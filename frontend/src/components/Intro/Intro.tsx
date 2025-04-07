import { Trans, useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import ButtonContainer from "../ButtonContainer/ButtonContainer";

const Intro = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="px-page pt-14 pb-10 md:pt-20 md:pb-14">
      <div className="mx-auto w-full max-w-page text-center md:text-left">
        {/* <div className="grid w-full md:grid-cols-1 md:grid-rows-1">
          <div className="md:col-span-full md:row-span-full md:self-end md:mix-blend-difference">
            <h1>
              <Trans i18nKey={KEYS.INTRO.TITLE}>
                0 <span className="underline decoration-primary">1</span>2
              </Trans>
            </h1>

            <h2 className="mt-8 text-2xl font-bold text-white sm:text-3xl md:mt-7 lg:text-4xl">
              {t(KEYS.INTRO.JOB)}
            </h2>
            <p className="mt-6 max-w-md text-lg max-md:mx-auto sm:text-xl md:mt-8">
              <Trans i18nKey={KEYS.INTRO.DESC}>
                0 <br />2
              </Trans>
            </p>

            <ButtonContainer
              hideText={true}
              hasRoundedButtons={true}
              className="mt-10 flex items-center justify-center gap-6 md:justify-start"
            />
          </div>

          <img
            src="/assets/images/Foto.webp"
            alt="Portrait of Arne"
            className="portrait-img place-self-center rounded-full outline-4 outline-offset-8 outline-dark-light max-md:mt-14 md:col-span-full md:row-span-full md:place-self-end"
          />
        </div> */}

        <hgroup className="mx-auto mt-14 max-w-md sm:mt-16 md:mt-18 md:mr-0 md:text-right">
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
