import { Plus_Jakarta_Sans } from "next/font/google";
import SafeLink from "@/components/SafeLink";
import { ArrowUpRightIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/templates/Icons";
import { getInitials, splitList, dateRange, displayUrl } from "@/lib/format";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

function Card({ id, title, className = "", children }) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8 ${className}`}
    >
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ModernTemplate({ portfolio }) {
  const { education, skills, projects, experiences, social_links } = portfolio;

  // Navigation lists only the sections that have content
  const nav = [
    portfolio.about_me && { href: "#about", label: "About" },
    skills.length > 0 && { href: "#skills", label: "Skills" },
    projects.length > 0 && { href: "#projects", label: "Projects" },
    (experiences.length > 0 || education.length > 0) && { href: "#journey", label: "Journey" },
    { href: "#contact", label: "Contact" },
  ].filter(Boolean);

  const stats = [
    projects.length > 0 && { label: "Projects", value: projects.length },
    skills.length > 0 && { label: "Skills", value: skills.length },
    experiences.length > 0 && { label: "Roles", value: experiences.length },
  ].filter(Boolean);

  const bothJourney = experiences.length > 0 && education.length > 0;

  return (
    <div className={`${font.className} space-y-5 rounded-[2rem] bg-slate-100 p-3 sm:p-5`}>
      {/* STICKY NAVIGATION */}
      <nav className="sticky top-3 z-10 flex items-center justify-between gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <span className="flex shrink-0 items-center gap-2 pl-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {getInitials(portfolio.full_name)}
          </span>
          <span className="hidden text-sm font-semibold text-slate-900 sm:inline">
            {portfolio.full_name}
          </span>
        </span>
        <div className="flex gap-1 overflow-x-auto">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
          {portfolio.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portfolio.profile_image}
              alt={portfolio.full_name}
              className="h-32 w-32 shrink-0 rounded-3xl object-cover ring-4 ring-white/20 sm:h-36 sm:w-36"
            />
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-4xl font-bold ring-4 ring-white/20 sm:h-36 sm:w-36">
              {getInitials(portfolio.full_name)}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {portfolio.full_name}
            </h1>
            {portfolio.address && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-slate-300 sm:justify-start">
                <PinIcon /> {portfolio.address}
              </p>
            )}
            <a
              href={`mailto:${portfolio.email}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-indigo-100"
            >
              <MailIcon /> Get in touch
            </a>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="relative mt-8 flex gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs uppercase tracking-wider text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* ABOUT */}
      {portfolio.about_me && (
        <Card id="about" title="About me">
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
            {portfolio.about_me}
          </p>
        </Card>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <Card id="skills" title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100"
              >
                {skill.skill_name}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Card id="projects" title="Projects">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="h-1.5 bg-linear-to-r from-indigo-500 to-violet-500" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-900">{project.project_name}</h3>
                  {project.description && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {project.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {splitList(project.technologies).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <SafeLink
                    href={project.project_link}
                    className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View project <ArrowUpRightIcon width={14} height={14} />
                  </SafeLink>
                </div>
              </article>
            ))}
          </div>
        </Card>
      )}

      {/* JOURNEY: experience + education */}
      {(experiences.length > 0 || education.length > 0) && (
        <div id="journey" className="grid scroll-mt-24 gap-5 lg:grid-cols-2">
          {experiences.length > 0 && (
            <Card title="Experience" className={bothJourney ? "" : "lg:col-span-2"}>
              <div className="space-y-4">
                {experiences.map((job) => (
                  <div key={job.id} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{job.job_title}</h3>
                      <p className="text-sm font-medium text-indigo-600">{job.company}</p>
                      <p className="text-xs text-slate-500">
                        {dateRange(job.start_date, job.end_date)}
                      </p>
                      {job.description && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {job.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {education.length > 0 && (
            <Card title="Education" className={bothJourney ? "" : "lg:col-span-2"}>
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">{item.school}</h3>
                    {item.degree && <p className="text-sm font-medium text-indigo-600">{item.degree}</p>}
                    {item.year && <p className="text-xs text-slate-500">{item.year}</p>}
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* CONTACT */}
      <Card id="contact" title="Contact">
        <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <li className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
            <MailIcon className="shrink-0 text-indigo-600" /> {portfolio.email}
          </li>
          {portfolio.contact_number && (
            <li className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <PhoneIcon className="shrink-0 text-indigo-600" /> {portfolio.contact_number}
            </li>
          )}
          {portfolio.address && (
            <li className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <PinIcon className="shrink-0 text-indigo-600" /> {portfolio.address}
            </li>
          )}
        </ul>

        {social_links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {social_links.map((link) => (
              <SafeLink
                key={link.id}
                href={link.url}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {link.platform} <ArrowUpRightIcon width={14} height={14} />
              </SafeLink>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}