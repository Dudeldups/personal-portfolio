import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "motion/react";
import skills from "../../data/skills.json";
import TechIcon from "./TechIcon";

const Skills = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasRevealedColors = useInView(sectionRef, {
    amount: 1,
    once: true,
  });

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section px-page max-lg:bg-dark"
    >
      <div className="@container/skills mx-auto w-full max-w-page text-center lg:text-left">
        <hgroup>
          <h2>{t("skills.title")}</h2>
          <p className="mx-auto max-lg:max-w-96">{t("skills.desc")}</p>
        </hgroup>
        <ul className="mx-auto mt-10 flex w-full max-w-sm flex-wrap justify-center justify-items-center gap-x-4 gap-y-8 lg:mt-16 @sm:grid @sm:max-w-max @sm:grid-cols-4">
          {skills.map(
            (skill, index) =>
              !skill.isHidden && (
                <li
                  key={skill.name}
                  className="flex flex-col items-center gap-2.5"
                >
                  <TechIcon
                    tech={skill.name}
                    delayMs={index * 230}
                    isColored={hasRevealedColors}
                    className="text-3xl xs:text-5xl"
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
