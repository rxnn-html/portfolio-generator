import SafeLink from "@/components/SafeLink";
import { getInitials, splitList, dateRange } from "@/lib/format";

function Card({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-4 rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

export default function ModernTemplate({ portfolio }) {
  const { education, skills, projects, experiences, social_links } = portfolio;

  // Navigation only lists sections that actually have content
  const nav = [
    portfolio.about_me && { href: "#about", label: "About" },
    education.length > 0 && { href: "#education", label: "Education" },
    skills.length > 0 && { href: "#skills", label: "Skills" },
    projects.length > 0 && { href: "#projects", label: "Projects" },
    experiences.length > 0 && { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ].filter(Boolean);

  return (
    <div className="space-y-6 rounded-3xl bg-slate-100 p-4 sm:p-6">
      {/* HERO + NAVIGATION */}
      <header className="rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          {portfolio.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portfolio.profile_image}
              alt={portfolio.full_name}
              className="h-32 w-32 rounded-full border-4 border-white/40 object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20 text-4xl font-bold">
              {getInitials(portfolio.full_name)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{portfolio.full_name}</h1>
            {portfolio.address && <p className="mt-1 text-indigo-100">{portfolio.address}</p>}
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium hover:bg-white/30"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {portfolio.about_me && (
        <Card id="about" title="About Me">
          <p className="whitespace-pre-line leading-relaxed text-slate-600">{portfolio.about_me}</p>
        </Card>
      )}

      {education.length > 0 && (
        <Card id="education" title="Education">
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">{item.school}</h3>
                {item.degree && <p className="text-sm text-indigo-600">{item.degree}</p>}
                {item.year && <p className="text-xs text-slate-500">{item.year}</p>}
                {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {skills.length > 0 && (
        <Card id="skills" title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700"
              >
                {skill.skill_name}
              </span>
            ))}
          </div>
        </Card>
      )}

      {projects.length > 0 && (
        <Card id="projects" title="Projects">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col rounded-2xl border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{project.project_name}</h3>
                {project.description && (
                  <p className="mt-2 flex-1 text-sm text-slate-600">{project.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {splitList(project.technologies).map((tech) => (
                    <span key={tech} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {tech}
                    </span>
                  ))}
                </div>
                <SafeLink
                  href={project.project_link}
                  className="mt-4 inline-block self-start rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  View project
                </SafeLink>
              </div>
            ))}
          </div>
        </Card>
      )}

      {experiences.length > 0 && (
        <Card id="experience" title="Experience">
          <div className="space-y-4">
            {experiences.map((job) => (
              <div key={job.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-slate-900">{job.job_title}</h3>
                  <span className="mt-1 w-fit rounded-full bg-white px-3 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200 sm:mt-0">
                    {dateRange(job.start_date, job.end_date)}
                  </span>
                </div>
                <p className="text-sm text-indigo-600">{job.company}</p>
                {job.description && <p className="mt-2 text-sm text-slate-600">{job.description}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card id="contact" title="Contact">
        <ul className="space-y-1 text-sm text-slate-600">
          <li>Email: {portfolio.email}</li>
          {portfolio.contact_number && <li>Phone: {portfolio.contact_number}</li>}
          {portfolio.address && <li>Address: {portfolio.address}</li>}
        </ul>
        {social_links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {social_links.map((link) => (
              <SafeLink
                key={link.id}
                href={link.url}
                className="rounded-lg border border-indigo-200 px-4 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                {link.platform}
              </SafeLink>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}