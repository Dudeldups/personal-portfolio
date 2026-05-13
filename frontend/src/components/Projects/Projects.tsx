import { useTranslation } from "react-i18next";
import projects from "../../data/projects.json";
import { useStoreRef } from "../../hooks/useStoreRef";

const Projects = () => {
  const { t } = useTranslation();
  const projectsRef = useStoreRef("projects");

  return (
    <section ref={projectsRef} id="projects" className="section px-page">
      <div className="mx-auto w-full max-w-page">
        <hgroup className="mx-auto text-center max-lg:max-w-100 lg:text-left">
          <h2>{t("projects.title")}</h2>
          <p>{t("projects.desc")}</p>
        </hgroup>

        <ul className="mt-12 grid gap-8">
          {projects.map((project) => {
            const titleString = `projects.${project.id}.title`;
            const descString = `projects.${project.id}.desc`;

            return (
              <li
                key={project.id}
                className="rounded-3xl border border-light/10 bg-light/6 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-8 md:p-6"
              >
                <div className="flex flex-col items-center gap-7 lg:items-start">
                  <hgroup className="text-center max-lg:max-w-md lg:text-left">
                    <h3 className="mb-5 text-2xl underline decoration-accent underline-offset-4">
                      {t(titleString)}
                    </h3>
                    <p>{t(descString)}</p>
                  </hgroup>

                  <div className="flex flex-wrap justify-center gap-4">
                    {project.techs.map((tech) => (
                      <div
                        key={project.id + tech}
                        className="rounded-full border border-light/12 bg-light px-3 py-0.5 backdrop-blur-sm"
                      >
                        <span className="text-sm font-bold text-nowrap text-darkest">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <picture className="mt-8 block overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={`/assets/images/project-previews/${project.image}`}
                    alt={`Preview of the ${project.title} website`}
                    className="aspect-video w-full object-cover object-top transition-[object-position] duration-2500 ease-[cubic-bezier(0.4,0.005,0.6,0.995)] hover:object-bottom"
                  />
                </picture>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.demoLink}
                    className="inline-flex min-w-35 items-center justify-center rounded-md border border-light/20 bg-light/92 px-5 py-2 text-sm font-bold text-darkest shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/90 hover:text-darkest focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
                  >
                    {t("projects.liveButton")}
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.githubLink}
                    className="inline-flex min-w-35 items-center justify-center rounded-md border border-light/16 bg-light/10 px-5 py-2 text-sm font-bold text-light shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-light/28 hover:bg-light/16 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                  >
                    {t("projects.githubButton")}
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
