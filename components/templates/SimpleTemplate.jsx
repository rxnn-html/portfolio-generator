import SafeLink from "@/components/SafeLink";
import { getInitials, dateRange } from "@/lib/format";

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </h2>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

export default function SimpleTemplate({ portfolio }) {
  const { education, skills, projects, experiences, social_links } = portfolio;

  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white px-6 py-10 text-gray-800 shadow-sm sm:px-12">
      {/* PROFILE */}
      <header className="text-center">
        {portfolio.profile_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portfolio.profile_image}
            alt={portfolio.full_name}
            className="mx-auto h-28 w-28 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-3xl font-semibold text-gray-500">
            {getInitials(portfolio.full_name)}
          </div>
        )}
        <h1 className="mt-4 font-serif text-3xl font-bold text-gray-900">{portfolio.full_name}</h1>
      </header>

      {/* ABOUT ME */}
      {portfolio.about_me && (
        <Section title="About Me">
          <p className="whitespace-pre-line leading-relaxed">{portfolio.about_me}</p>
        </Section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((item) => (
            <div key={item.id}>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <h3 className="font-semibold text-gray-900">{item.school}</h3>
                {item.year && <span className="text-sm text-gray-500">{item.year}</span>}
              </div>
              {item.degree && <p className="text-sm italic text-gray-600">{item.degree}</p>}
              {item.description && <p className="mt-1 text-sm leading-relaxed">{item.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <Section title="Skills">
          <p>{skills.map((skill) => skill.skill_name).join("  •  ")}</p>
        </Section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((project) => (
            <div key={project.id}>
              <h3 className="font-semibold text-gray-900">{project.project_name}</h3>
              {project.technologies && (
                <p className="text-sm italic text-gray-600">{project.technologies}</p>
              )}
              {project.description && (
                <p className="mt-1 text-sm leading-relaxed">{project.description}</p>
              )}
              <SafeLink href={project.project_link} className="mt-1 inline-block text-sm text-gray-900 underline">
                View project
              </SafeLink>
            </div>
          ))}
        </Section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <Section title="Experience">
          {experiences.map((job) => (
            <div key={job.id}>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                <span className="text-sm text-gray-500">{dateRange(job.start_date, job.end_date)}</span>
              </div>
              <p className="text-sm italic text-gray-600">{job.company}</p>
              {job.description && <p className="mt-1 text-sm leading-relaxed">{job.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* CONTACT */}
      <Section title="Contact">
        <ul className="space-y-1 text-sm">
          <li>Email: {portfolio.email}</li>
          {portfolio.contact_number && <li>Phone: {portfolio.contact_number}</li>}
          {portfolio.address && <li>Address: {portfolio.address}</li>}
        </ul>
      </Section>

      {/* SOCIAL LINKS */}
      {social_links.length > 0 && (
        <Section title="Social Links">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {social_links.map((link) => (
              <li key={link.id}>
                <SafeLink href={link.url} className="text-gray-900 underline">
                  {link.platform}
                </SafeLink>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}