import { useTranslation } from "react-i18next";
import { useStoreRef } from "../../hooks/useStoreRef";

const Intro = () => {
  const { t } = useTranslation();
  const aboutRef = useStoreRef("about");

  return (
    <section
      ref={aboutRef}
      id="about"
      className="section px-page md:pb-14 lg:pt-18"
    >
      <div className="mx-auto w-full max-w-page text-center lg:text-left">
        <hgroup className="mx-auto mt-8 max-lg:max-w-md lg:mt-0 lg:text-left">
          <h2>{t("about.title")}</h2>
          <p>{t("about.desc")}</p>
          <p className="my-2">{t("about.desc2")}</p>
          <p>{t("about.desc3")}</p>
        </hgroup>
      </div>
    </section>
  );
};

export default Intro;
