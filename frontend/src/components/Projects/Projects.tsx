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

        <ul className="mt-12 grid gap-12">
          {projects.map((project) => {
            const titleString = `projects.${project.id}.title`;
            const descString = `projects.${project.id}.desc`;

            return (
              <li
                key={project.id}
                className="border-t-dark-light pt-8 not-first:border-t-2"
              >
                <div className="flex flex-col items-center gap-7 lg:items-start">
                  <hgroup className="text-center max-lg:max-w-md lg:text-left">
                    <h3 className="mb-5 text-2xl underline decoration-white underline-offset-4">
                      {t(titleString)}
                    </h3>
                    <p>{t(descString)}</p>
                  </hgroup>

                  <div className="flex justify-center gap-4">
                    {project.techs.map((tech) => (
                      <div
                        key={project.id + tech}
                        className="rounded-md border border-white px-2 py-0.5"
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
                    className="aspect-video w-full object-cover object-top transition-[object-position] duration-3000 hover:object-bottom"
                  />
                </picture>

                <div className="mt-8 flex justify-center gap-5">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.demoLink}
                    className="btn font-bold text-darkest"
                  >
                    {t("projects.liveButton")}
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.githubLink}
                    className="btn font-bold text-darkest"
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
