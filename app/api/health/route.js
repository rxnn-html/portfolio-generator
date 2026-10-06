import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  cleanPortfolio,
  validatePortfolio,
  validateImage,
  IMAGE_EXTENSIONS,
} from "@/lib/validation";

const BUCKET = "profile-images";

// Helper: a 400 response for bad input
function badRequest(errors) {
  return NextResponse.json({ errors }, { status: 400 });
}

// Helper: undo a half-finished save.
// Deleting the portfolio also deletes its child rows (ON DELETE CASCADE).
async function rollback(portfolioId, imagePath) {
  if (portfolioId) {
    await supabase.from("portfolios").delete().eq("id", portfolioId);
  }
  if (imagePath) {
    await supabase.storage.from(BUCKET).remove([imagePath]);
  }
}

export async function POST(request) {
  /* ---- 1. Read the request ---- */
  let formData;
  let raw;
  try {
    formData = await request.formData();
    raw = JSON.parse(formData.get("data"));
  } catch {
    return badRequest(["The submitted data was not valid."]);
  }

  /* ---- 2. Clean and validate (the real check) ---- */
  const clean = cleanPortfolio(raw);
  const errors = validatePortfolio(clean);

  const image = formData.get("image");
  const hasImage = image && typeof image !== "string" && image.size > 0;
  if (hasImage) {
    const imageProblem = validateImage(image);
    if (imageProblem) errors.push(imageProblem);
  }

  if (errors.length > 0) return badRequest(errors);

  /* ---- 3. Upload the image (if any) ---- */
  let imageUrl = null;
  let imagePath = null;

  if (hasImage) {
    // The file name is made by us, never taken from the user
    imagePath = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[image.type]}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(imagePath, await image.arrayBuffer(), { contentType: image.type });

    if (uploadError) {
      console.error("Image upload failed:", uploadError.message);
      return NextResponse.json(
        { message: "The profile picture could not be uploaded. Please try again." },
        { status: 500 }
      );
    }

    imageUrl = supabase.storage.from(BUCKET).getPublicUrl(imagePath).data.publicUrl;
  }

  /* ---- 4. Insert the main portfolio row ---- */
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .insert({
      full_name: clean.full_name,
      profile_image: imageUrl,
      email: clean.email,
      contact_number: clean.contact_number,
      address: clean.address,
      about_me: clean.about_me,
      template: "simple", // default; the user picks the real one next
    })
    .select("id")
    .single();

  if (portfolioError) {
    console.error("Portfolio insert failed:", portfolioError.message);
    await rollback(null, imagePath);
    return NextResponse.json(
      { message: "Your portfolio could not be saved. Please try again." },
      { status: 500 }
    );
  }

  /* ---- 5. Insert the child rows ---- */
  const id = portfolio.id;
  const withId = (rows) => rows.map((row) => ({ ...row, portfolio_id: id }));
  const insertRows = (table, rows) =>
    rows.length > 0 ? supabase.from(table).insert(withId(rows)) : null;

  const results = await Promise.all([
    insertRows("education", clean.education),
    insertRows("skills", clean.skills.map((name) => ({ skill_name: name }))),
    insertRows("projects", clean.projects),
    insertRows("experiences", clean.experiences),
    insertRows("social_links", clean.social_links),
  ]);

  const failed = results.find((result) => result && result.error);
  if (failed) {
    console.error("Child insert failed:", failed.error.message);
    await rollback(id, imagePath);
    return NextResponse.json(
      { message: "Your portfolio could not be saved. Please try again." },
      { status: 500 }
    );
  }

  /* ---- 6. Success ---- */
  return NextResponse.json({ id }, { status: 201 });
}