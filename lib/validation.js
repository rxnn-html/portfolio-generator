// Shared rules. The SAME file is used by the form (friendly early messages)
// and by the API route (the real security check).

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const PLATFORMS = ["GitHub", "Facebook", "LinkedIn", "Instagram", "Website"];

export const MAX_ITEMS = {
  education: 10,
  skills: 30,
  projects: 20,
  experiences: 20,
  social_links: 10,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

// Turn anything into a trimmed string (non-strings become "")
const text = (value) => (typeof value === "string" ? value.trim() : "");

// Only http:// and https:// links are allowed (blocks "javascript:" links)
export function isSafeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Check an uploaded image file. Returns an error message, or null if OK.
export function validateImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Profile picture must be a JPG, PNG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Profile picture must be 2 MB or smaller.";
  }
  return null;
}

// Trim everything, drop completely empty rows, and keep ONLY the fields we know.
// Anything extra that someone sneaks into the request is thrown away.
export function cleanPortfolio(raw) {
  const r = raw && typeof raw === "object" ? raw : {};
  const list = (value) => (Array.isArray(value) ? value : []);
  const hasContent = (obj) => Object.values(obj).some(Boolean);

  return {
    full_name: text(r.full_name),
    email: text(r.email),
    contact_number: text(r.contact_number),
    address: text(r.address),
    about_me: text(r.about_me),

    education: list(r.education)
      .map((e) => ({
        school: text(e?.school),
        degree: text(e?.degree),
        year: text(e?.year),
        description: text(e?.description),
      }))
      .filter(hasContent),

    skills: list(r.skills)
      .map((s) => text(s))
      .filter(Boolean),

    projects: list(r.projects)
      .map((p) => ({
        project_name: text(p?.project_name),
        description: text(p?.description),
        technologies: text(p?.technologies),
        project_link: text(p?.project_link),
      }))
      .filter(hasContent),

    experiences: list(r.experiences)
      .map((x) => ({
        job_title: text(x?.job_title),
        company: text(x?.company),
        start_date: text(x?.start_date),
        end_date: text(x?.end_date),
        description: text(x?.description),
      }))
      .filter(hasContent),

    // A social row with no URL is meaningless, so it is dropped
    social_links: list(r.social_links)
      .map((l) => ({ platform: text(l?.platform), url: text(l?.url) }))
      .filter((l) => l.url),
  };
}

// Check the cleaned data. Returns a list of error messages (empty list = valid).
export function validatePortfolio(d) {
  const errors = [];
  const tooLong = (label, value, max) => {
    if (value.length > max) errors.push(`${label} must be ${max} characters or less.`);
  };

  // Personal information
  if (!d.full_name) errors.push("Full name is required.");
  else tooLong("Full name", d.full_name, 100);

  if (!d.email) errors.push("Email is required.");
  else if (!EMAIL_PATTERN.test(d.email) || d.email.length > 254)
    errors.push("Please enter a valid email address (example: name@example.com).");

  if (d.contact_number && !PHONE_PATTERN.test(d.contact_number))
    errors.push("Contact number must be 7-20 characters and use only digits, spaces, + ( ) or -.");

  tooLong("Address", d.address, 200);
  tooLong("About me", d.about_me, 1500);

  // Maximum number of rows in each list
  for (const [key, max] of Object.entries(MAX_ITEMS)) {
    if (d[key].length > max)
      errors.push(`You can add at most ${max} entries in ${key.replace("_", " ")}.`);
  }

  // Education
  d.education.forEach((e, i) => {
    const n = `Education ${i + 1}`;
    if (!e.school) errors.push(`${n}: school is required.`);
    tooLong(`${n} school`, e.school, 150);
    tooLong(`${n} degree`, e.degree, 150);
    tooLong(`${n} year`, e.year, 30);
    tooLong(`${n} description`, e.description, 1000);
  });

  // Skills
  d.skills.forEach((skill, i) => tooLong(`Skill ${i + 1}`, skill, 50));

  // Projects
  d.projects.forEach((p, i) => {
    const n = `Project ${i + 1}`;
    if (!p.project_name) errors.push(`${n}: project name is required.`);
    tooLong(`${n} name`, p.project_name, 150);
    tooLong(`${n} description`, p.description, 1000);
    tooLong(`${n} technologies`, p.technologies, 200);
    if (p.project_link && (!isSafeUrl(p.project_link) || p.project_link.length > 500))
      errors.push(`${n}: the link must start with http:// or https://`);
  });

  // Work experience
  d.experiences.forEach((x, i) => {
    const n = `Experience ${i + 1}`;
    if (!x.job_title) errors.push(`${n}: job title is required.`);
    if (!x.company) errors.push(`${n}: company is required.`);
    tooLong(`${n} job title`, x.job_title, 150);
    tooLong(`${n} company`, x.company, 150);
    tooLong(`${n} start date`, x.start_date, 30);
    tooLong(`${n} end date`, x.end_date, 30);
    tooLong(`${n} description`, x.description, 1000);
  });

  // Social links
  d.social_links.forEach((l, i) => {
    const n = `Social link ${i + 1}`;
    if (!PLATFORMS.includes(l.platform)) errors.push(`${n}: please choose a valid platform.`);
    if (!isSafeUrl(l.url) || l.url.length > 500)
      errors.push(`${n}: the URL must start with http:// or https://`);
  });

  return errors;
}