import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { skills } from "../../data/skills";

const Skills = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div>
        <h2>{t(KEYS.SKILLS.TITLE)}</h2>
        <p>{t(KEYS.SKILLS.DESC)}</p>
        <ul>
          {skills.map(
            (skill) =>
              !skill.isHidden && (
                <li key={skill.name}>
                  {skill.icon}
                  <span>{skill.name}</span>
                </li>
              ),
          )}
        </ul>
      </div>
    </section>
  );
};

export default Skills;
