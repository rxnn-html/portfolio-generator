import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getPortfolio, isValidId } from "@/lib/getPortfolio";
import {
  cleanPortfolio,
  validatePortfolio,
  validateImage,
  IMAGE_EXTENSIONS,
} from "@/lib/validation";
import { BUCKET, imagePathFromUrl } from "@/lib/storage";

const TEMPLATES = ["simple", "modern", "creative"];
const CHILD_TABLES = ["education", "skills", "projects", "experiences", "social_links"];

function notFoundResponse() {
  return NextResponse.json({ message: "Portfolio not found." }, { status: 404 });
}

function serverError(message) {
  return NextResponse.json({ message }, { status: 500 });
}

/* =====================================================
   PATCH: change only the template
   ===================================================== */
export async function PATCH(request, { params }) {
  const { id } = await params; // in Next.js 16, params is a Promise
  if (!isValidId(id)) return notFoundResponse();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "The submitted data was not valid." }, { status: 400 });
  }

  if (!TEMPLATES.includes(body?.template)) {
    return NextResponse.json(
      { message: "Template must be simple, modern, or creative." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("portfolios")
    .update({ template: body.template })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Template update failed:", error.message);
    return serverError("The template could not be saved. Please try again.");
  }
  if (!data || data.length === 0) return notFoundResponse();

  return NextResponse.json({ id, template: body.template });
}

/* =====================================================
   Helper: put the OLD data back if an edit fails halfway
   ===================================================== */
async function restore(old, newImagePath) {
  await supabase
    .from("portfolios")
    .update({
      full_name: old.full_name,
      profile_image: old.profile_image,
      email: old.email,
      contact_number: old.contact_number,
      address: old.address,
      about_me: old.about_me,
    })
    .eq("id", old.id);

  for (const table of CHILD_TABLES) {
    await supabase.from(table).delete().eq("portfolio_id", old.id);
    if (old[table].length > 0) await supabase.from(table).insert(old[table]);
  }

  if (newImagePath) await supabase.storage.from(BUCKET).remove([newImagePath]);
}

/* =====================================================
   PUT: replace the whole portfolio with the edited version
   ===================================================== */
export async function PUT(request, { params }) {
  const { id } = await params;
  if (!isValidId(id)) return notFoundResponse();

  /* 1. Read the request */
  let formData;
  let raw;
  try {
    formData = await request.formData();
    raw = JSON.parse(formData.get("data"));
  } catch {
    return NextResponse.json({ errors: ["The submitted data was not valid."] }, { status: 400 });
  }

  /* 2. Validate (the real check) */
  const clean = cleanPortfolio(raw);
  const errors = validatePortfolio(clean);

  const image = formData.get("image");
  const hasImage = image && typeof image !== "string" && image.size > 0;
  if (hasImage) {
    const imageProblem = validateImage(image);
    if (imageProblem) errors.push(imageProblem);
  }
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

  /* 3. Load the current data (needed for undo and for old-image cleanup) */
  let old;
  try {
    old = await getPortfolio(id);
  } catch {
    return serverError("Your changes could not be saved. Please try again.");
  }
  if (!old) return notFoundResponse();

  /* 4. Decide what happens to the picture */
  const removeImage = formData.get("removeImage") === "true";
  let imageUrl = old.profile_image;
  let newImagePath = null;

  if (hasImage) {
    newImagePath = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[image.type]}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newImagePath, await image.arrayBuffer(), { contentType: image.type });

    if (uploadError) {
      console.error("Image upload failed:", uploadError.message);
      return serverError("The profile picture could not be uploaded. Please try again.");
    }
    imageUrl = supabase.storage.from(BUCKET).getPublicUrl(newImagePath).data.publicUrl;
  } else if (removeImage) {
    imageUrl = null;
  }

  /* 5. Update the main row (the template is NOT touched here) */
  const { error: updateError } = await supabase
    .from("portfolios")
    .update({
      full_name: clean.full_name,
      profile_image: imageUrl,
      email: clean.email,
      contact_number: clean.contact_number,
      address: clean.address,
      about_me: clean.about_me,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Portfolio update failed:", updateError.message);
    if (newImagePath) await supabase.storage.from(BUCKET).remove([newImagePath]);
    return serverError("Your changes could not be saved. Please try again.");
  }

  /* 6. Replace the child rows: delete the old ones, insert the new ones */
  const newRows = {
    education: clean.education,
    skills: clean.skills.map((name) => ({ skill_name: name })),
    projects: clean.projects,
    experiences: clean.experiences,
    social_links: clean.social_links,
  };

  const deletes = await Promise.all(
    CHILD_TABLES.map((table) => supabase.from(table).delete().eq("portfolio_id", id))
  );
  let failed = deletes.find((result) => result.error);

  if (!failed) {
    const inserts = await Promise.all(
      CHILD_TABLES.filter((table) => newRows[table].length > 0).map((table) =>
        supabase.from(table).insert(newRows[table].map((row) => ({ ...row, portfolio_id: id })))
      )
    );
    failed = inserts.find((result) => result.error);
  }

  if (failed) {
    console.error("Child rows update failed:", failed.error.message);
    await restore(old, newImagePath); // undo everything
    return serverError("Your changes could not be saved. Please try again.");
  }

  /* 7. Success: remove the OLD picture file if it was replaced or removed */
  if (imageUrl !== old.profile_image) {
    const oldPath = imagePathFromUrl(old.profile_image);
    if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
  }

  return NextResponse.json({ id });
}

/* =====================================================
   DELETE: remove the portfolio (and its picture)
   ===================================================== */
export async function DELETE(_request, { params }) {
  const { id } = await params;
  if (!isValidId(id)) return notFoundResponse();

  // Find it first, so we know which picture file to remove afterwards
  const { data: existing, error: findError } = await supabase
    .from("portfolios")
    .select("id, profile_image")
    .eq("id", id)
    .maybeSingle();

  if (findError) {
    console.error("Delete lookup failed:", findError.message);
    return serverError("The portfolio could not be deleted. Please try again.");
  }
  if (!existing) return notFoundResponse();

  // ON DELETE CASCADE removes education, skills, projects, experiences,
  // and social_links automatically. .select("id") lets us confirm a row was really deleted.
  const { data: deleted, error: deleteError } = await supabase
    .from("portfolios")
    .delete()
    .eq("id", id)
    .select("id");

  if (deleteError || !deleted || deleted.length === 0) {
    console.error("Delete failed:", deleteError?.message || "no row was deleted");
    return serverError("The portfolio could not be deleted. Please try again.");
  }

  // Remove the picture file (a failure here is logged, but the delete still counts)
  const imagePath = imagePathFromUrl(existing.profile_image);
  if (imagePath) {
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([imagePath]);
    if (removeError) console.error("Image cleanup failed:", removeError.message);
  }

  return NextResponse.json({ id });
}