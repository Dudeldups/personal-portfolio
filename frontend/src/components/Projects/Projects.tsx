import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import projects from "../../data/projects.json";

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section id="projects" className="section px-page">
      <div className="mx-auto w-full max-w-page">
        <hgroup className="mx-auto text-center max-lg:max-w-[25rem] lg:text-left">
          <h2>{t(KEYS.PROJECTS.TITLE)}</h2>
          <p>{t(KEYS.PROJECTS.DESC)}</p>
        </hgroup>

        <ul className="mt-12 grid gap-12">
          {projects.map((project) => {
            const uppercaseTitle =
              project.title.toUpperCase() as keyof typeof KEYS.PROJECTS;
            const titleString = "PROJECTS." + uppercaseTitle + ".TITLE";
            const descString = "PROJECTS." + uppercaseTitle + ".DESC";

            return (
              <li
                key={project.title}
                className="border-t-dark-light pt-8 not-first:border-t-2"
              >
                <div className="flex flex-col items-center gap-7 lg:items-start">
                  <hgroup className="max-w-2xs text-center lg:text-left">
                    <h3 className="mb-5 text-2xl underline decoration-white underline-offset-4">
                      {t(titleString)}
                    </h3>
                    <p>{t(descString)}</p>
                  </hgroup>

                  <div className="flex justify-center gap-4">
                    {project.techs.map((tech) => (
                      <div
                        key={project.title + tech}
                        className="rounded-md border-1 border-white px-2 py-0.5"
                      >
                        <span className="text-sm font-bold text-white">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <picture className="mt-8 block">
                  <img
                    src={`/assets/images/project-previews/${project.image}`}
                    alt={`Preview of the ${project.title} website`}
                    className="aspect-[16/9] w-full object-cover object-top transition-[object-position] duration-3000 hover:object-bottom"
                  />
                </picture>

                <div className="mt-8 flex justify-center gap-5">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.demoLink}
                    className="btn font-bold text-darkest"
                  >
                    {t(KEYS.PROJECTS.LIVE_BUTTON)}
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.githubLink}
                    className="btn font-bold text-darkest"
                  >
                    {t(KEYS.PROJECTS.GITHUB_BUTTON)}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
