import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Intro = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div>
        <h1>{t(KEYS.INTRO.TITLE)}</h1>
        <p>{t(KEYS.INTRO.LOCATION)}</p>
        <p>{t(KEYS.INTRO.JOB)}</p>
        <p>{t(KEYS.INTRO.DESC)}</p>
        <a href="#contact">{t(KEYS.INTRO.BUTTON)}</a>
      </div>

      <picture>
        <source
          media="(min-width: 600px)"
          srcSet="https://sayedanowar.netlify.app/assets/img/DP.webp"
        />
        <img
          src="https://sayedanowar.netlify.app/assets/img/DP.webp"
          alt="Portrait of Arne"
        />
      </picture>

      <div>
        <h2>{t(KEYS.ABOUT.TITLE)}</h2>
        <p>{t(KEYS.ABOUT.DESC)}</p>
      </div>
    </section>
  );
};

export default Intro;
