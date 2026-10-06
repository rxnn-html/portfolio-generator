import { Inter, Source_Serif_4 } from "next/font/google";
import SafeLink from "@/components/SafeLink";
import { ArrowUpRightIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/templates/Icons";
import { getInitials, dateRange, displayUrl, splitList } from "@/lib/format";

const sans = Inter({ subsets: ["latin"], display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], display: "swap" });

// A section: small label on the left, content on the right (stacks on phones)
function Row({ title, children }) {
  return (
    <section className="grid gap-4 border-t border-slate-200 py-8 md:grid-cols-[10rem_1fr] md:gap-10">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </h2>
      <div className="min-w-0 space-y-6">{children}</div>
    </section>
  );
}

function Entry({ title, meta, subtitle, children }) {
  return (
    <div>
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className={`${serif.className} text-lg font-semibold text-slate-900`}>{title}</h3>
        {meta && (
          <span className="shrink-0 text-xs tabular-nums tracking-wide text-slate-500">{meta}</span>
        )}
      </div>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      {children && (
        <div className="mt-2 text-[15px] leading-relaxed text-slate-600">{children}</div>
      )}
    </div>
  );
}

export default function SimpleTemplate({ portfolio }) {
  const { education, skills, projects, experiences, social_links } = portfolio;

  return (
    <article
      className={`${sans.className} mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-slate-700 shadow-sm sm:px-14 sm:py-16 print:border-0 print:shadow-none`}
    >
      {/* PROFILE */}
      <header className="flex flex-col items-start gap-6 pb-10 sm:flex-row sm:items-center sm:gap-8">
        {portfolio.profile_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portfolio.profile_image}
            alt={portfolio.full_name}
            className="h-28 w-28 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div
            className={`${serif.className} flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-slate-100 text-3xl font-semibold text-slate-500`}
          >
            {getInitials(portfolio.full_name)}
          </div>
        )}

        <div className="min-w-0">
          <h1
            className={`${serif.className} text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl`}
          >
            {portfolio.full_name}
          </h1>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
            <li className="flex items-center gap-1.5">
              <MailIcon /> {portfolio.email}
            </li>
            {portfolio.contact_number && (
              <li className="flex items-center gap-1.5">
                <PhoneIcon /> {portfolio.contact_number}
              </li>
            )}
            {portfolio.address && (
              <li className="flex items-center gap-1.5">
                <PinIcon /> {portfolio.address}
              </li>
            )}
          </ul>
        </div>
      </header>

      {/* ABOUT ME */}
      {portfolio.about_me && (
        <Row title="About">
          <p className={`${serif.className} whitespace-pre-line text-lg leading-relaxed text-slate-700`}>
            {portfolio.about_me}
          </p>
        </Row>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <Row title="Experience">
          {experiences.map((job) => (
            <Entry
              key={job.id}
              title={job.job_title}
              subtitle={job.company}
              meta={dateRange(job.start_date, job.end_date)}
            >
              {job.description}
            </Entry>
          ))}
        </Row>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Row title="Projects">
          {projects.map((project) => (
            <Entry key={project.id} title={project.project_name}>
              {project.description && <p>{project.description}</p>}
              {project.technologies && (
                <p className="mt-2 font-mono text-xs text-slate-500">
                  {splitList(project.technologies).join("  ·  ")}
                </p>
              )}
              <SafeLink
                href={project.project_link}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
              >
                {displayUrl(project.project_link)} <ArrowUpRightIcon width={14} height={14} />
              </SafeLink>
            </Entry>
          ))}
        </Row>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <Row title="Education">
          {education.map((item) => (
            <Entry key={item.id} title={item.school} subtitle={item.degree} meta={item.year}>
              {item.description}
            </Entry>
          ))}
        </Row>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <Row title="Skills">
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-sm text-slate-700"
              >
                {skill.skill_name}
              </li>
            ))}
          </ul>
        </Row>
      )}

      {/* CONTACT + SOCIAL LINKS */}
      <Row title="Contact">
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[6rem_1fr]">
          <dt className="text-slate-400">Email</dt>
          <dd className="text-slate-900">{portfolio.email}</dd>
          {portfolio.contact_number && (
            <>
              <dt className="text-slate-400">Phone</dt>
              <dd className="text-slate-900">{portfolio.contact_number}</dd>
            </>
          )}
          {portfolio.address && (
            <>
              <dt className="text-slate-400">Location</dt>
              <dd className="text-slate-900">{portfolio.address}</dd>
            </>
          )}
          {social_links.map((link) => (
            <div key={link.id} className="contents">
              <dt className="text-slate-400">{link.platform}</dt>
              <dd>
                <SafeLink
                  href={link.url}
                  className="inline-flex items-center gap-1 text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                >
                  {displayUrl(link.url)} <ArrowUpRightIcon width={14} height={14} />
                </SafeLink>
              </dd>
            </div>
          ))}
        </dl>
      </Row>
    </article>
  );
}