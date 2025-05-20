import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { useStoreRef } from "../../hooks/useStoreRef";

const Intro = () => {
  const { t } = useTranslation();
  const aboutRef = useStoreRef("about");

  return (
    <section
      ref={aboutRef}
      id="about"
      className="px-page py-10 md:pb-14 lg:pt-18"
    >
      <div className="mx-auto w-full max-w-page text-center lg:text-left">
        <hgroup className="mx-auto mt-8 max-lg:max-w-md lg:mt-0 lg:text-left">
          <h2>{t(KEYS.ABOUT.TITLE)}</h2>
          <p>{t(KEYS.ABOUT.DESC)}</p>
          <p className="my-2">{t(KEYS.ABOUT.DESC_2)}</p>
          <p>{t(KEYS.ABOUT.DESC_3)}</p>
        </hgroup>
      </div>
    </section>
  );
};

export default Intro;
