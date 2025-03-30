import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import projects from "../../data/projects.json";

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div>
        <h2>{t(KEYS.PROJECTS.TITLE)}</h2>
        <p>{t(KEYS.PROJECTS.DESC)}</p>

        <ul>
          {projects.map((project) => {
            const uppercaseTitle =
              project.title.toUpperCase() as keyof typeof KEYS.PROJECTS;
            const titleString = "PROJECTS." + uppercaseTitle + ".TITLE";
            const descString = "PROJECTS." + uppercaseTitle + ".DESC";

            return (
              <li key={project.title}>
                <h3>{t(titleString)}</h3>
                <p>{t(descString)}</p>

                <img
                  src={`/assets/images/project-previews/${project.image}`}
                  alt={`Preview of the ${project.title} website`}
                />

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
