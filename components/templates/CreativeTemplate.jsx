import { Fraunces, Space_Grotesk } from "next/font/google";
import SafeLink from "@/components/SafeLink";
import { ArrowUpRightIcon } from "@/components/templates/Icons";
import { getInitials, splitList, dateRange } from "@/lib/format";

const body = Space_Grotesk({ subsets: ["latin"], display: "swap" });
const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], display: "swap" });

// Numbered section heading: "01  Toolbox ———"
function Section({ n, title, className = "", children }) {
  return (
    <section className={className}>
      <div className="mb-8 flex items-baseline gap-4">
        <span className="font-mono text-sm text-amber-300">{n}</span>
        <h2 className={`${display.className} text-3xl font-bold italic text-white sm:text-4xl`}>
          {title}
        </h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      {children}
    </section>
  );
}

// Vertical line with glowing dots (used for experience and education)
function Timeline({ items }) {
  return (
    <ol className="relative ml-2 border-l border-white/15">
      {items.map((item) => (
        <li key={item.id} className="relative mb-9 pl-8 last:mb-0">
          <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.15)]" />
          {item.when && (
            <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
              {item.when}
            </p>
          )}
          <h3 className="mt-1 text-xl font-bold text-white">{item.title}</h3>
          {item.subtitle && <p className="text-sm text-slate-400">{item.subtitle}</p>}
          {item.text && (
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function CreativeTemplate({ portfolio }) {
  const { education, skills, projects, experiences, social_links } = portfolio;

  // Name split: "Juan Dela Cruz" -> first "Juan Dela", last "Cruz" (gradient)
  const words = portfolio.full_name.trim().split(/\s+/);
  const last = words.pop();
  const first = words.join(" ");

  const experienceItems = experiences.map((x) => ({
    id: x.id,
    when: dateRange(x.start_date, x.end_date),
    title: x.job_title,
    subtitle: x.company,
    text: x.description,
  }));
  const educationItems = education.map((e) => ({
    id: e.id,
    when: e.year,
    title: e.school,
    subtitle: e.degree,
    text: e.description,
  }));

  // Section numbers only count the sections that are actually shown
  const present = [
    portfolio.about_me && "about",
    skills.length > 0 && "skills",
    experienceItems.length > 0 && "experience",
    educationItems.length > 0 && "education",
    projects.length > 0 && "projects",
  ].filter(Boolean);
  const num = (key) => String(present.indexOf(key) + 1).padStart(2, "0");

  const bothPath = experienceItems.length > 0 && educationItems.length > 0;

  return (
    <div
      className={`${body.className} overflow-hidden rounded-[2rem] bg-slate-950 text-slate-200 shadow-2xl`}
    >
      {/* HERO */}
      <header className="relative overflow-hidden px-6 pb-14 pt-10 sm:px-12 sm:pt-14 lg:px-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />

        <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-300">
              {portfolio.address ? `Based in ${portfolio.address}` : "Portfolio"}
            </p>
            <h1
              className={`${display.className} mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl`}
            >
              {first && <span className="block text-white">{first}</span>}
              <span className="block bg-linear-to-r from-amber-300 via-fuchsia-400 to-violet-400 bg-clip-text italic text-transparent">
                {last}
              </span>
            </h1>
          </div>

          <div className="relative mx-auto lg:mx-0">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-3xl border-2 border-amber-300" />
            {portfolio.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portfolio.profile_image}
                alt={portfolio.full_name}
                className="relative h-44 w-44 -rotate-3 rounded-3xl object-cover sm:h-56 sm:w-56"
              />
            ) : (
              <div
                className={`${display.className} relative flex h-44 w-44 -rotate-3 items-center justify-center rounded-3xl bg-amber-300 text-6xl font-black text-slate-950 sm:h-56 sm:w-56`}
              >
                {getInitials(portfolio.full_name)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="space-y-20 px-6 py-14 sm:px-12 lg:px-16">
        {portfolio.about_me && (
          <Section n={num("about")} title="Hello.">
            <p className="max-w-3xl whitespace-pre-line text-xl leading-relaxed text-slate-300 sm:text-2xl">
              {portfolio.about_me}
            </p>
          </Section>
        )}

        {skills.length > 0 && (
          <Section n={num("skills")} title="Toolbox">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span
                  key={skill.id}
                  className={`border border-amber-300/60 bg-amber-300/5 px-4 py-2 text-sm font-semibold text-amber-200 ${
                    i % 2 === 0 ? "-rotate-1" : "rotate-1"
                  }`}
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {(experienceItems.length > 0 || educationItems.length > 0) && (
          <div className={`grid gap-16 ${bothPath ? "lg:grid-cols-2" : ""}`}>
            {experienceItems.length > 0 && (
              <Section n={num("experience")} title="Journey">
                <Timeline items={experienceItems} />
              </Section>
            )}
            {educationItems.length > 0 && (
              <Section n={num("education")} title="Learning">
                <Timeline items={educationItems} />
              </Section>
            )}
          </div>
        )}

        {projects.length > 0 && (
          <Section n={num("projects")} title="Selected work">
            <div className="border-b border-white/10">
              {projects.map((project, i) => (
                <article
                  key={project.id}
                  className="group grid gap-3 border-t border-white/10 py-8 transition hover:bg-white/[0.03] md:grid-cols-[6rem_1fr] md:gap-6"
                >
                  <span
                    className={`${display.className} text-5xl font-black text-fuchsia-500/40 transition group-hover:text-amber-300 sm:text-6xl`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {project.project_name}
                    </h3>
                    {project.description && (
                      <p className="mt-2 max-w-2xl leading-relaxed text-slate-400">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {splitList(project.technologies).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/15 px-3 py-0.5 font-mono text-xs text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <SafeLink
                      href={project.project_link}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-300 hover:text-amber-300"
                    >
                      Open project <ArrowUpRightIcon width={15} height={15} />
                    </SafeLink>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* FOOTER / CONTACT */}
      <footer className="border-t border-white/10 bg-black/30 px-6 py-14 sm:px-12 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">
          Let&apos;s work together
        </p>
        <a
          href={`mailto:${portfolio.email}`}
          className={`${display.className} mt-4 block break-all text-3xl font-black italic text-white transition hover:text-amber-300 sm:text-5xl`}
        >
          {portfolio.email}
        </a>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-400">
          {portfolio.contact_number && <p>{portfolio.contact_number}</p>}
          {portfolio.address && <p>{portfolio.address}</p>}
        </div>

        {social_links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {social_links.map((link) => (
              <SafeLink
                key={link.id}
                href={link.url}
                className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-fuchsia-200 transition hover:bg-fuchsia-400 hover:text-slate-950"
              >
                {link.platform} <ArrowUpRightIcon width={13} height={13} />
              </SafeLink>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
}