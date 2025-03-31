import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import projects from "../../data/projects.json";

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section
      id="projects"
      className="section mx-auto w-full max-w-page px-page"
    >
      <div>
        <hgroup className="text-center">
          <h2>{t(KEYS.PROJECTS.TITLE)}</h2>
          <p>{t(KEYS.PROJECTS.DESC)}</p>
        </hgroup>

        <ul className="mt-10 grid gap-8">
          {projects.map((project) => {
            const uppercaseTitle =
              project.title.toUpperCase() as keyof typeof KEYS.PROJECTS;
            const titleString = "PROJECTS." + uppercaseTitle + ".TITLE";
            const descString = "PROJECTS." + uppercaseTitle + ".DESC";

            return (
              <li key={project.title}>
                <hgroup className="text-center">
                  <h3 className="mb-3 text-2xl">{t(titleString)}</h3>
                  <p>{t(descString)}</p>
                </hgroup>

                <picture className="mt-6 block aspect-square bg-pink-400 p-1">
                  <img
                    src={`/assets/images/project-previews/${project.image}`}
                    alt={`Preview of the ${project.title} website`}
                    className=""
                  />
                </picture>

                <div>
                  <a href={project.demoLink} className="btn">
                    {t(KEYS.PROJECTS.LIVE_BUTTON)}
                  </a>
                  <a href={project.githubLink} className="btn">
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
