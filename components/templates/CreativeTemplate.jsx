import SafeLink from "@/components/SafeLink";
import { getInitials, splitList, dateRange } from "@/lib/format";

function Heading({ children }) {
  return (
    <h2 className="mb-6 font-serif text-3xl font-black italic text-amber-300">{children}</h2>
  );
}

// A vertical line with dots: used for both Education and Experience
function Timeline({ items }) {
  return (
    <ol className="relative ml-2 border-l-2 border-fuchsia-500/40">
      {items.map((item) => (
        <li key={item.id} className="mb-8 ml-6 last:mb-0">
          <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-slate-900 bg-amber-400" />
          {item.when && (
            <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">{item.when}</p>
          )}
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          {item.subtitle && <p className="text-sm text-slate-400">{item.subtitle}</p>}
          {item.text && <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>}
        </li>
      ))}
    </ol>
  );
}

export default function CreativeTemplate({ portfolio }) {
  const { education, skills, projects, experiences, social_links } = portfolio;

  const educationItems = education.map((e) => ({
    id: e.id, when: e.year, title: e.school, subtitle: e.degree, text: e.description,
  }));
  const experienceItems = experiences.map((x) => ({
    id: x.id, when: dateRange(x.start_date, x.end_date), title: x.job_title, subtitle: x.company, text: x.description,
  }));

  return (
    <div className="overflow-hidden rounded-3xl bg-slate-900 text-slate-200 shadow-xl">
      <div className="grid lg:grid-cols-3">
        {/* LEFT COLUMN: identity */}
        <aside className="bg-slate-950 p-8 lg:sticky lg:top-0 lg:h-fit lg:p-10">
          {portfolio.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portfolio.profile_image}
              alt={portfolio.full_name}
              className="h-40 w-40 rotate-3 rounded-3xl border-4 border-amber-400 object-cover"
            />
          ) : (
            <div className="flex h-40 w-40 rotate-3 items-center justify-center rounded-3xl bg-amber-400 font-serif text-5xl font-black text-slate-900">
              {getInitials(portfolio.full_name)}
            </div>
          )}

          <h1 className="mt-8 font-serif text-4xl font-black leading-tight text-white sm:text-5xl">
            {portfolio.full_name}
          </h1>

          <div className="mt-6 space-y-1 text-sm text-slate-400">
            <p>{portfolio.email}</p>
            {portfolio.contact_number && <p>{portfolio.contact_number}</p>}
            {portfolio.address && <p>{portfolio.address}</p>}
          </div>

          {social_links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {social_links.map((link) => (
                <SafeLink
                  key={link.id}
                  href={link.url}
                  className="rounded-full border border-fuchsia-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-300 hover:bg-fuchsia-400 hover:text-slate-900"
                >
                  {link.platform}
                </SafeLink>
              ))}
            </div>
          )}
        </aside>

        {/* RIGHT COLUMNS: content */}
        <div className="space-y-14 p-8 lg:col-span-2 lg:p-12">
          {portfolio.about_me && (
            <section>
              <Heading>Hello.</Heading>
              <p className="whitespace-pre-line text-lg leading-relaxed text-slate-300">
                {portfolio.about_me}
              </p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <Heading>Toolbox</Heading>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <span
                    key={skill.id}
                    className={`border-2 border-amber-400 px-4 py-1.5 font-semibold text-amber-300 ${
                      i % 2 === 0 ? "-rotate-1" : "rotate-1"
                    }`}
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {experienceItems.length > 0 && (
            <section>
              <Heading>Journey</Heading>
              <Timeline items={experienceItems} />
            </section>
          )}

          {educationItems.length > 0 && (
            <section>
              <Heading>Learning</Heading>
              <Timeline items={educationItems} />
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <Heading>Selected Work</Heading>
              <div className="divide-y divide-slate-700">
                {projects.map((project, i) => (
                  <div key={project.id} className="flex gap-5 py-6 first:pt-0">
                    <span className="font-serif text-5xl font-black text-fuchsia-500/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.project_name}</h3>
                      {project.description && (
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{project.description}</p>
                      )}
                      {project.technologies && (
                        <p className="mt-2 text-xs uppercase tracking-widest text-amber-300">
                          {splitList(project.technologies).join(" / ")}
                        </p>
                      )}
                      <SafeLink
                        href={project.project_link}
                        className="mt-3 inline-block text-sm font-semibold text-fuchsia-300 underline underline-offset-4 hover:text-fuchsia-200"
                      >
                        Open project →
                      </SafeLink>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}