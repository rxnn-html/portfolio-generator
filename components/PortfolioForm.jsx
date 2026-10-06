"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  cleanPortfolio,
  validatePortfolio,
  validateImage,
  PLATFORMS,
  MAX_ITEMS,
} from "@/lib/validation";

// A blank row for each repeating section
const emptyEducation = { school: "", degree: "", year: "", description: "" };
const emptySkill = { skill_name: "" };
const emptyProject = { project_name: "", description: "", technologies: "", project_link: "" };
const emptyExperience = { job_title: "", company: "", start_date: "", end_date: "", description: "" };
const emptySocial = { platform: "GitHub", url: "" };

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

// Builds the starting form data: blank for "create", filled in for "edit"
function toFormState(p) {
  // A list from the database -> form rows (or one blank row if the list is empty)
  const rows = (list, mapRow, blank) =>
    list && list.length > 0 ? list.map(mapRow) : [{ ...blank }];

  return {
    full_name: p?.full_name || "",
    email: p?.email || "",
    contact_number: p?.contact_number || "",
    address: p?.address || "",
    about_me: p?.about_me || "",
    education: rows(
      p?.education,
      (e) => ({
        school: e.school || "",
        degree: e.degree || "",
        year: e.year || "",
        description: e.description || "",
      }),
      emptyEducation
    ),
    skills: rows(p?.skills, (s) => ({ skill_name: s.skill_name || "" }), emptySkill),
    projects: rows(
      p?.projects,
      (x) => ({
        project_name: x.project_name || "",
        description: x.description || "",
        technologies: x.technologies || "",
        project_link: x.project_link || "",
      }),
      emptyProject
    ),
    experiences: rows(
      p?.experiences,
      (x) => ({
        job_title: x.job_title || "",
        company: x.company || "",
        start_date: x.start_date || "",
        end_date: x.end_date || "",
        description: x.description || "",
      }),
      emptyExperience
    ),
    social_links: rows(
      p?.social_links,
      (l) => ({ platform: l.platform || "GitHub", url: l.url || "" }),
      emptySocial
    ),
  };
}

/* ---------- Small reusable pieces (kept OUTSIDE the main component on purpose) ---------- */

function Section({ title, description, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, required, type = "text", placeholder, multiline }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function ItemCard({ title, onRemove, children }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function AddButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      + {children}
    </button>
  );
}

/* ---------- The main form ---------- */

// "portfolio" is only given in edit mode
export default function PortfolioForm({ portfolio = null }) {
  const router = useRouter();
  const isEditing = Boolean(portfolio);
  const existingImage = portfolio?.profile_image || null;

  const [data, setData] = useState(() => toFormState(portfolio));
  const [image, setImage] = useState(null); // a newly chosen File
  const [preview, setPreview] = useState(existingImage); // picture shown on screen
  const [removeImage, setRemoveImage] = useState(false); // "remove current picture" checkbox
  const [imageError, setImageError] = useState("");
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  function updateField(name, value) {
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function updateItem(listName, index, field, value) {
    setData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addItem(listName, emptyItem) {
    setData((prev) => ({ ...prev, [listName]: [...prev[listName], { ...emptyItem }] }));
  }

  function removeItem(listName, index) {
    setData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      setPreview(existingImage); // fall back to the saved picture
      setImageError("");
      return;
    }

    const problem = validateImage(file);
    if (problem) {
      setImage(null);
      setPreview(existingImage);
      setImageError(problem);
      e.target.value = ""; // clear the chosen file
      return;
    }

    setImageError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function showErrors(messages) {
    setErrors(messages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    // 1. Clean and validate in the browser (fast, friendly feedback)
    const cleaned = cleanPortfolio({
      ...data,
      skills: data.skills.map((s) => s.skill_name),
    });
    const problems = validatePortfolio(cleaned);
    if (imageError) problems.push(imageError);

    if (problems.length > 0) {
      showErrors(problems);
      return;
    }

    // 2. Send to the server: PUT updates, POST creates
    setSaving(true);
    try {
      const body = new FormData();
      body.append("data", JSON.stringify(cleaned));
      if (image) body.append("image", image);
      if (isEditing && removeImage && !image) body.append("removeImage", "true");

      const url = isEditing ? `/api/portfolios/${portfolio.id}` : "/api/portfolios";
      const response = await fetch(url, { method: isEditing ? "PUT" : "POST", body });
      const result = await response.json();

      if (!response.ok) {
        showErrors(result.errors || [result.message || "Something went wrong. Please try again."]);
        return;
      }

      // 3. Success
      router.push(isEditing ? `/portfolio/${portfolio.id}` : `/templates?id=${result.id}`);
    } catch {
      showErrors(["Could not reach the server. Check your internet connection and try again."]);
    } finally {
      setSaving(false);
    }
  }

  // Hide the picture on screen if the user ticked "remove" (and has not picked a new one)
  const shownPreview = removeImage && !image ? null : preview;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errors.length > 0 && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {errors.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* PERSONAL INFORMATION */}
      <Section title="Personal Information" description="Fields marked with * are required.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full Name" required value={data.full_name}
            onChange={(v) => updateField("full_name", v)} placeholder="Juan Dela Cruz" />
          <TextField label="Email" required type="email" value={data.email}
            onChange={(v) => updateField("email", v)} placeholder="juan@example.com" />
          <TextField label="Contact Number" value={data.contact_number}
            onChange={(v) => updateField("contact_number", v)} placeholder="+63 912 345 6789" />
          <TextField label="Address" value={data.address}
            onChange={(v) => updateField("address", v)} placeholder="Cebu City, Philippines" />
        </div>

        <TextField label="About Me" multiline value={data.about_me}
          onChange={(v) => updateField("about_me", v)}
          placeholder="Write a short introduction about yourself..." />

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">Profile Picture</span>
          <div className="flex items-center gap-4">
            {shownPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownPreview} alt="Profile preview"
                className="h-20 w-20 shrink-0 rounded-full border border-gray-200 object-cover" />
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, or WebP. Maximum 2 MB.
            {isEditing && existingImage && " Choose a new file to replace the current picture."}
          </p>
          {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}

          {isEditing && existingImage && !image && (
            <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={removeImage}
                onChange={(e) => setRemoveImage(e.target.checked)} />
              Remove current picture
            </label>
          )}
        </div>
      </Section>

      {/* EDUCATION */}
      <Section title="Education" description="Empty rows are ignored, so leave a row blank if you don't need it.">
        {data.education.map((item, i) => (
          <ItemCard key={i} title={`Education ${i + 1}`} onRemove={() => removeItem("education", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="School" required value={item.school}
                onChange={(v) => updateItem("education", i, "school", v)} />
              <TextField label="Degree / Course" value={item.degree}
                onChange={(v) => updateItem("education", i, "degree", v)} />
              <TextField label="Year" value={item.year} placeholder="2022 - 2026"
                onChange={(v) => updateItem("education", i, "year", v)} />
            </div>
            <TextField label="Description" multiline value={item.description}
              onChange={(v) => updateItem("education", i, "description", v)} />
          </ItemCard>
        ))}
        <AddButton onClick={() => addItem("education", emptyEducation)}
          disabled={data.education.length >= MAX_ITEMS.education}>
          Add Education
        </AddButton>
      </Section>

      {/* SKILLS */}
      <Section title="Skills" description="Add one skill per box, for example HTML, CSS, or JavaScript.">
        {data.skills.map((item, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <TextField label={`Skill ${i + 1}`} value={item.skill_name}
                onChange={(v) => updateItem("skills", i, "skill_name", v)} />
            </div>
            <button type="button" onClick={() => removeItem("skills", i)}
              className="rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Remove
            </button>
          </div>
        ))}
        <AddButton onClick={() => addItem("skills", emptySkill)}
          disabled={data.skills.length >= MAX_ITEMS.skills}>
          Add Skill
        </AddButton>
      </Section>

      {/* PROJECTS */}
      <Section title="Projects">
        {data.projects.map((item, i) => (
          <ItemCard key={i} title={`Project ${i + 1}`} onRemove={() => removeItem("projects", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Project Name" required value={item.project_name}
                onChange={(v) => updateItem("projects", i, "project_name", v)} />
              <TextField label="Technologies Used" value={item.technologies}
                placeholder="React, Node.js, Supabase"
                onChange={(v) => updateItem("projects", i, "technologies", v)} />
            </div>
            <TextField label="Project Link" value={item.project_link}
              placeholder="https://github.com/you/project"
              onChange={(v) => updateItem("projects", i, "project_link", v)} />
            <TextField label="Description" multiline value={item.description}
              onChange={(v) => updateItem("projects", i, "description", v)} />
          </ItemCard>
        ))}
        <AddButton onClick={() => addItem("projects", emptyProject)}
          disabled={data.projects.length >= MAX_ITEMS.projects}>
          Add Project
        </AddButton>
      </Section>

      {/* WORK EXPERIENCE */}
      <Section title="Work Experience">
        {data.experiences.map((item, i) => (
          <ItemCard key={i} title={`Experience ${i + 1}`} onRemove={() => removeItem("experiences", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Job Title" required value={item.job_title}
                onChange={(v) => updateItem("experiences", i, "job_title", v)} />
              <TextField label="Company" required value={item.company}
                onChange={(v) => updateItem("experiences", i, "company", v)} />
              <TextField label="Start Date" value={item.start_date} placeholder="Jan 2024"
                onChange={(v) => updateItem("experiences", i, "start_date", v)} />
              <TextField label="End Date" value={item.end_date} placeholder="Present"
                onChange={(v) => updateItem("experiences", i, "end_date", v)} />
            </div>
            <TextField label="Description" multiline value={item.description}
              onChange={(v) => updateItem("experiences", i, "description", v)} />
          </ItemCard>
        ))}
        <AddButton onClick={() => addItem("experiences", emptyExperience)}
          disabled={data.experiences.length >= MAX_ITEMS.experiences}>
          Add Experience
        </AddButton>
      </Section>

      {/* SOCIAL LINKS */}
      <Section title="Social Media / Website Links"
        description="Links must start with https:// (rows without a URL are ignored).">
        {data.social_links.map((item, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="block sm:w-44">
              <span className="mb-1 block text-sm font-medium text-gray-700">Platform</span>
              <select className={inputClass} value={item.platform}
                onChange={(e) => updateItem("social_links", i, "platform", e.target.value)}>
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </label>
            <div className="flex-1">
              <TextField label="URL" value={item.url} placeholder="https://github.com/yourname"
                onChange={(v) => updateItem("social_links", i, "url", v)} />
            </div>
            <button type="button" onClick={() => removeItem("social_links", i)}
              className="rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Remove
            </button>
          </div>
        ))}
        <AddButton onClick={() => addItem("social_links", emptySocial)}
          disabled={data.social_links.length >= MAX_ITEMS.social_links}>
          Add Link
        </AddButton>
      </Section>

      {/* SAVE */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={isEditing ? `/portfolio/${portfolio.id}` : "/"}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Cancel
        </Link>
        <button type="submit" disabled={saving}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Save & Choose Template"}
        </button>
      </div>
    </form>
  );
}