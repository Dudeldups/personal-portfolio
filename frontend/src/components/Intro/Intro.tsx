import { Trans, useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import ButtonContainer from "../ButtonContainer/ButtonContainer";
import { FaLocationDot } from "react-icons/fa6";

const Intro = () => {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="px-page mt-14 w-full text-center md:text-left"
    >
      <div className="grid w-full gap-6 md:grid-cols-12 md:grid-rows-1">
        <div className="md:col-span-full md:row-span-full">
          <h1>
            <Trans i18nKey={KEYS.INTRO.TITLE}>
              0 <span className="underline decoration-primary">1</span>2
            </Trans>
          </h1>
          <div className="mt-6 flex items-center gap-1.5 max-md:justify-center">
            <FaLocationDot />
            <p className="">{t(KEYS.INTRO.LOCATION)}</p>
          </div>
          <p className="mt-1 text-2xl">{t(KEYS.INTRO.JOB)}</p>
          <p className="mt-4 mb-5 max-w-md text-xl mix-blend-difference max-md:mx-auto">
            {t(KEYS.INTRO.DESC)}
          </p>
          <ButtonContainer showText={false} />
        </div>
        <img
          src="/assets/images/Foto.webp"
          alt="Portrait of Arne"
          className="md:col-start-4 md:col-end-12 md:row-span-full"
        />
      </div>

      <div>
        <h2 className="">{t(KEYS.ABOUT.TITLE)}</h2>
        <p>{t(KEYS.ABOUT.DESC)}</p>
        <p>{t(KEYS.ABOUT.DESC_2)}</p>
        <p>{t(KEYS.ABOUT.DESC_3)}</p>
      </div>
    </section>
  );
};

export default Intro;
