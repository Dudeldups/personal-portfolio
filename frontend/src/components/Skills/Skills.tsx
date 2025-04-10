import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import skills from "../../data/skills.json";
import TechIcon from "./TechIcon";

const Skills = () => {
  const { t } = useTranslation();

  return (
    <section id="skills" className="section px-page max-lg:bg-dark">
      <div className="mx-auto w-full max-w-page text-center lg:text-left">
        <hgroup>
          <h2>{t(KEYS.SKILLS.TITLE)}</h2>
          <p className="mx-auto max-lg:max-w-96">{t(KEYS.SKILLS.DESC)}</p>
        </hgroup>
        <ul className="mx-auto mt-10 flex max-w-[22rem] flex-wrap justify-center gap-8 lg:mt-16">
          {skills.map(
            (skill) =>
              !skill.isHidden && (
                <li
                  key={skill.name}
                  className="flex flex-col items-center gap-2.5"
                >
                  <TechIcon
                    tech={skill.name}
                    className="text-2xl xs:text-5xl"
                  />
                  <span className="md:text-lg">{skill.name}</span>
                </li>
              ),
          )}
        </ul>
      </div>
    </section>
  );
};

export default Skills;
