"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  cleanPortfolio,
  validatePortfolio,
  validateImage,
  PLATFORMS,
  MAX_ITEMS,
} from "@/lib/validation";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormSection from "@/components/ui/FormSection";
import { TextField, TextArea, SelectField, inputClass } from "@/components/ui/Field";
import {
  BoltIcon,
  BookIcon,
  BriefcaseIcon,
  CheckIcon,
  FolderIcon,
  ImageIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "@/components/ui/Icons";

// A blank row for each repeating section
const emptyEducation = { school: "", degree: "", year: "", description: "" };
const emptyProject = { project_name: "", description: "", technologies: "", project_link: "" };
const emptyExperience = { job_title: "", company: "", start_date: "", end_date: "", description: "" };
const emptySocial = { platform: "GitHub", url: "" };

const SUGGESTED_SKILLS = [
  "HTML", "CSS", "JavaScript", "React", "Node.js",
  "Python", "Java", "PHP", "SQL", "Git",
];

// Builds the starting form data: blank for "create", filled in for "edit"
function toFormState(p) {
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
    // Skills are chips, so an empty list stays empty (no blank row)
    skills: (p?.skills || []).map((s) => ({ skill_name: s.skill_name || "" })),
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

// "HTML, CSS" -> adds two skills, skipping duplicates, blanks, and too-long names
function mergeSkills(list, raw) {
  const next = [...list];
  for (const name of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (next.length >= MAX_ITEMS.skills) break;
    if (name.length > 50) continue;
    if (next.some((s) => s.skill_name.toLowerCase() === name.toLowerCase())) continue;
    next.push({ skill_name: name });
  }
  return next;
}

/* ---------- Small pieces (kept OUTSIDE the main component on purpose) ---------- */

function EmptyHint({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
      {children}
    </p>
  );
}

function ItemCard({ index, title, onRemove, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-700">
            {index}
          </span>
          <h3 className="truncate text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <Button variant="danger-ghost" size="sm" onClick={onRemove} aria-label={`Remove ${title}`}>
          <TrashIcon width={16} height={16} />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function AddButton({ onClick, disabled, children }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick} disabled={disabled}>
      <PlusIcon width={16} height={16} /> {children}
    </Button>
  );
}

function ProgressCard({ checks, percent }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Profile strength</p>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{percent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-4 flex flex-wrap gap-1 lg:flex-col">
        {checks.map((check) => (
          <li key={check.id}>
            <a
              href={`#${check.id}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  check.done
                    ? "bg-emerald-500 text-white"
                    : "border border-gray-300 text-transparent"
                }`}
              >
                <CheckIcon width={12} height={12} />
              </span>
              {check.label}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-gray-500">
        Only personal info is required. The rest makes your portfolio stand out.
      </p>
    </div>
  );
}

function PhotoPicker({ preview, error, inputRef, onFile, onRemove }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">Profile picture</span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        className={`flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-center transition sm:flex-row sm:text-left ${
          dragging ? "border-indigo-500 bg-indigo-500/10" : "border-gray-300 bg-gray-50"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Profile preview"
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-gray-200"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ImageIcon width={32} height={32} />
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Drag and drop a photo here</p>
          <p className="mt-0.5 text-xs text-gray-500">JPG, PNG, or WebP · up to 2 MB</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
              <UploadIcon width={16} height={16} /> {preview ? "Replace photo" : "Choose photo"}
            </Button>
            {preview && (
              <Button variant="danger-ghost" size="sm" onClick={onRemove}>
                <TrashIcon width={16} height={16} /> Remove
              </Button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SkillsPicker({ skills, draft, onDraftChange, onAdd, onRemove }) {
  const atLimit = skills.length >= MAX_ITEMS.skills;
  const suggestions = SUGGESTED_SKILLS.filter(
    (name) => !skills.some((s) => s.skill_name.toLowerCase() === name.toLowerCase())
  );

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Enter must not submit the whole form
      if (draft.trim()) onAdd(draft);
    } else if (e.key === "Backspace" && draft === "" && skills.length > 0) {
      onRemove(skills.length - 1); // Backspace on an empty box removes the last chip
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="skill-input" className="mb-1.5 block text-sm font-medium text-gray-700">
          Add a skill
        </label>
        <div className="flex gap-2">
          <input
            id="skill-input"
            className={inputClass}
            value={draft}
            maxLength={300}
            disabled={atLimit}
            placeholder="Type a skill and press Enter"
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="secondary"
            onClick={() => draft.trim() && onAdd(draft)}
            disabled={atLimit}
          >
            <PlusIcon width={16} height={16} /> Add
          </Button>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Tip: paste several at once, separated by commas. ({skills.length}/{MAX_ITEMS.skills})
        </p>
      </div>

      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <li key={`${skill.skill_name}-${i}`}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 py-1 pl-3.5 pr-1.5 text-sm font-medium text-indigo-700">
                {skill.skill_name}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove ${skill.skill_name}`}
                  className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-indigo-500/20"
                >
                  <XIcon width={12} height={12} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyHint>No skills yet. Type one above or tap a suggestion below.</EmptyHint>
      )}

      {suggestions.length > 0 && !atLimit && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Quick add
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onAdd(name)}
                className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-600 transition hover:border-indigo-400 hover:text-indigo-600"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- The main form ---------- */

// "portfolio" is only given in edit mode
export default function PortfolioForm({ portfolio = null }) {
  const router = useRouter();
  const isEditing = Boolean(portfolio);
  const existingImage = portfolio?.profile_image || null;

  const [data, setData] = useState(() => toFormState(portfolio));
  const [skillDraft, setSkillDraft] = useState("");
  const [image, setImage] = useState(null); // a newly chosen File
  const [preview, setPreview] = useState(existingImage); // picture shown on screen
  const [removeImage, setRemoveImage] = useState(false); // delete the saved picture?
  const [imageError, setImageError] = useState("");
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const fileInput = useRef(null);
  const errorBox = useRef(null);

  // Whenever errors appear, scroll the red box into view
  useEffect(() => {
    if (errors.length > 0) {
      errorBox.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

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

  function addSkills(raw) {
    setData((prev) => ({ ...prev, skills: mergeSkills(prev.skills, raw) }));
    setSkillDraft("");
  }

  function handleFile(file) {
    const problem = validateImage(file);
    if (problem) {
      setImageError(problem);
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setImageError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleRemovePhoto() {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (fileInput.current) fileInput.current.value = "";
    setImage(null);
    setPreview(null);
    setImageError("");
    setRemoveImage(Boolean(existingImage)); // tell the server to delete the saved one
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    // 1. Clean and validate in the browser (fast, friendly feedback).
    //    A skill still typed in the box is included, so nothing is lost.
    const skills = mergeSkills(data.skills, skillDraft);
    const cleaned = cleanPortfolio({ ...data, skills: skills.map((s) => s.skill_name) });
    const problems = validatePortfolio(cleaned);
    if (imageError) problems.push(imageError);

    if (problems.length > 0) {
      setErrors(problems);
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
        setErrors(result.errors || [result.message || "Something went wrong. Please try again."]);
        setSaving(false);
        return;
      }

      // 3. Success: the button stays in its "Saving..." state while the page changes
           router.push(isEditing ? `/portfolio/${portfolio.id}?notice=saved` : `/templates?id=${result.id}`);
    } catch {
      setErrors(["Could not reach the server. Check your internet connection and try again."]);
      setSaving(false);
    }
  }

  // Live "profile strength": computed from the form data on every render
  const checks = [
    { id: "personal", label: "Personal info", done: Boolean(data.full_name.trim() && data.email.trim()) },
    { id: "education", label: "Education", done: data.education.some((e) => e.school.trim()) },
    { id: "skills", label: "Skills", done: data.skills.length > 0 },
    { id: "projects", label: "Projects", done: data.projects.some((p) => p.project_name.trim()) },
    { id: "experience", label: "Experience", done: data.experiences.some((x) => x.job_title.trim() && x.company.trim()) },
    { id: "links", label: "Links", done: data.social_links.some((l) => l.url.trim()) },
  ];
  const percent = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);

  return (
    // noValidate = use OUR messages instead of the browser's pop-up bubbles
    <form onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div ref={errorBox} className="mb-6">
          <Alert tone="error" title="Please fix the following:">
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          </Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_17rem] lg:items-start">
        {/* Progress card: on top for phones, a sticky sidebar on desktop */}
        <aside className="lg:sticky lg:top-6 lg:order-2">
          <ProgressCard checks={checks} percent={percent} />
        </aside>

        <div className="space-y-6 lg:order-1">
          {/* 1. PERSONAL */}
          <FormSection
            id="personal"
            number={1}
            icon={UserIcon}
            title="Personal information"
            description="Only your name and email are required."
          >
            <PhotoPicker
              preview={preview}
              error={imageError}
              inputRef={fileInput}
              onFile={handleFile}
              onRemove={handleRemovePhoto}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Full name" required maxLength={100} value={data.full_name}
                onChange={(v) => updateField("full_name", v)} placeholder="Juan Dela Cruz" autoComplete="name" />
              <TextField label="Email" required type="email" maxLength={254} value={data.email}
                onChange={(v) => updateField("email", v)} placeholder="juan@example.com" autoComplete="email" />
              <TextField label="Contact number" maxLength={20} value={data.contact_number}
                onChange={(v) => updateField("contact_number", v)} placeholder="+63 912 345 6789" autoComplete="tel" />
              <TextField label="Address" maxLength={200} value={data.address}
                onChange={(v) => updateField("address", v)} placeholder="Cebu City, Philippines" />
            </div>

            <TextArea label="About me" rows={5} maxLength={1500} value={data.about_me}
              onChange={(v) => updateField("about_me", v)}
              placeholder="Write a short introduction: who you are and what you love to build..." />
          </FormSection>

          {/* 2. EDUCATION */}
          <FormSection id="education" number={2} icon={BookIcon} title="Education"
            description="Empty rows are ignored, so you can leave one blank.">
            {data.education.length === 0 && <EmptyHint>No education added yet.</EmptyHint>}
            {data.education.map((item, i) => (
              <ItemCard key={i} index={i + 1} title={item.school || `Education ${i + 1}`}
                onRemove={() => removeItem("education", i)}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="School" required maxLength={150} value={item.school}
                    onChange={(v) => updateItem("education", i, "school", v)} />
                  <TextField label="Degree / Course" maxLength={150} value={item.degree}
                    onChange={(v) => updateItem("education", i, "degree", v)} />
                  <TextField label="Year" maxLength={30} value={item.year} placeholder="2022 - 2026"
                    onChange={(v) => updateItem("education", i, "year", v)} />
                </div>
                <TextArea label="Description" rows={3} maxLength={1000} value={item.description}
                  onChange={(v) => updateItem("education", i, "description", v)} />
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("education", emptyEducation)}
              disabled={data.education.length >= MAX_ITEMS.education}>
              Add education
            </AddButton>
          </FormSection>

          {/* 3. SKILLS */}
          <FormSection id="skills" number={3} icon={BoltIcon} title="Skills"
            description="Add the tools and technologies you work with.">
            <SkillsPicker
              skills={data.skills}
              draft={skillDraft}
              onDraftChange={setSkillDraft}
              onAdd={addSkills}
              onRemove={(i) => removeItem("skills", i)}
            />
          </FormSection>

          {/* 4. PROJECTS */}
          <FormSection id="projects" number={4} icon={FolderIcon} title="Projects"
            description="Show off what you have built.">
            {data.projects.length === 0 && <EmptyHint>No projects added yet.</EmptyHint>}
            {data.projects.map((item, i) => (
              <ItemCard key={i} index={i + 1} title={item.project_name || `Project ${i + 1}`}
                onRemove={() => removeItem("projects", i)}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="Project name" required maxLength={150} value={item.project_name}
                    onChange={(v) => updateItem("projects", i, "project_name", v)} />
                  <TextField label="Technologies used" maxLength={200} value={item.technologies}
                    placeholder="React, Node.js, Supabase"
                    onChange={(v) => updateItem("projects", i, "technologies", v)} />
                </div>
                <TextField label="Project link" maxLength={500} value={item.project_link}
                  placeholder="https://github.com/you/project"
                  hint="Must start with https://"
                  onChange={(v) => updateItem("projects", i, "project_link", v)} />
                <TextArea label="Description" rows={3} maxLength={1000} value={item.description}
                  onChange={(v) => updateItem("projects", i, "description", v)} />
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("projects", emptyProject)}
              disabled={data.projects.length >= MAX_ITEMS.projects}>
              Add project
            </AddButton>
          </FormSection>

          {/* 5. EXPERIENCE */}
          <FormSection id="experience" number={5} icon={BriefcaseIcon} title="Work experience"
            description="Internships and part-time work count too.">
            {data.experiences.length === 0 && <EmptyHint>No experience added yet.</EmptyHint>}
            {data.experiences.map((item, i) => (
              <ItemCard key={i} index={i + 1} title={item.job_title || `Experience ${i + 1}`}
                onRemove={() => removeItem("experiences", i)}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="Job title" required maxLength={150} value={item.job_title}
                    onChange={(v) => updateItem("experiences", i, "job_title", v)} />
                  <TextField label="Company" required maxLength={150} value={item.company}
                    onChange={(v) => updateItem("experiences", i, "company", v)} />
                  <TextField label="Start date" maxLength={30} value={item.start_date} placeholder="Jan 2024"
                    onChange={(v) => updateItem("experiences", i, "start_date", v)} />
                  <TextField label="End date" maxLength={30} value={item.end_date} placeholder="Present"
                    onChange={(v) => updateItem("experiences", i, "end_date", v)} />
                </div>
                <TextArea label="Description" rows={3} maxLength={1000} value={item.description}
                  onChange={(v) => updateItem("experiences", i, "description", v)} />
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("experiences", emptyExperience)}
              disabled={data.experiences.length >= MAX_ITEMS.experiences}>
              Add experience
            </AddButton>
          </FormSection>

          {/* 6. LINKS */}
          <FormSection id="links" number={6} icon={LinkIcon} title="Social media and website links"
            description="Links must start with https:// (rows without a URL are ignored).">
            {data.social_links.length === 0 && <EmptyHint>No links added yet.</EmptyHint>}
            {data.social_links.map((item, i) => (
              <div key={i} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="sm:w-44">
                  <SelectField label="Platform" value={item.platform} options={PLATFORMS}
                    onChange={(v) => updateItem("social_links", i, "platform", v)} />
                </div>
                <div className="flex-1">
                  <TextField label="URL" maxLength={500} value={item.url}
                    placeholder="https://github.com/yourname"
                    onChange={(v) => updateItem("social_links", i, "url", v)} />
                </div>
                <Button variant="danger-ghost" onClick={() => removeItem("social_links", i)}
                  aria-label={`Remove link ${i + 1}`}>
                  <TrashIcon width={16} height={16} />
                  <span className="sm:hidden">Remove</span>
                </Button>
              </div>
            ))}
            <AddButton onClick={() => addItem("social_links", emptySocial)}
              disabled={data.social_links.length >= MAX_ITEMS.social_links}>
              Add link
            </AddButton>
          </FormSection>
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      <div className="sticky bottom-4 z-20 mt-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden pl-2 text-sm text-gray-500 sm:block">
            {isEditing ? "Your template choice stays the same." : "Next step: choose a template."}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button href={isEditing ? `/portfolio/${portfolio.id}` : "/"} variant="secondary" size="lg">
              Cancel
            </Button>
            <Button type="submit" size="lg" loading={saving}>
              {saving ? "Saving..." : isEditing ? "Save changes" : "Save and choose template"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}