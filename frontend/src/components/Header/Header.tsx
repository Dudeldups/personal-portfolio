import { Trans, useTranslation } from "react-i18next";
import ButtonContainer from "./ButtonContainer";
import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";
import { KEYS } from "../../i18n/KEYS";
import { useInView } from "motion/react";
import { useRefStore } from "../../stores/refStore";

const Header = () => {
  const { t } = useTranslation();
  const aboutRef = useRefStore((state) => state.refs["about"]);
  const contactRef = useRefStore((state) => state.refs["contact"]);

  const isAboutInView = useInView(aboutRef ?? { current: null });
  const isContactInView = useInView(contactRef ?? { current: null }, {
    amount: 0.75,
  });

  return (
    <header className={`top-0 w-full shrink-[1.25] px-page lg:sticky`}>
      <div className="flex w-full flex-col items-center py-6 lg:min-h-screen lg:items-start lg:pb-14">
        <LanguageSwitcher className="self-end lg:hidden" />

        <div
          className={`mt-8 mb-12 text-center transition-transform lg:text-left ${isAboutInView ? "duration-700" : "delay-700 duration-1000 ease-in-out lg:-translate-y-20"}`}
        >
          <h1 className="">
            <Trans i18nKey={KEYS.INTRO.TITLE}>
              <span
                className={`inline-block transition-all duration-500 ${isAboutInView ? "delay-500" : "delay-200 ease-in lg:-translate-y-40 lg:scale-y-90 lg:opacity-0"}`}
              >
                0
              </span>
              <br />
              <span className="underline decoration-primary">2</span>
              <span
                className={`inline-block transition-all duration-500 ${isAboutInView ? "opacity-100 delay-700" : "delay-100 lg:scale-90 lg:opacity-0"}`}
              >
                3
              </span>
            </Trans>
          </h1>

          <h2 className="mt-8 text-2xl font-bold text-white sm:text-3xl md:mt-7 lg:text-4xl">
            {t(KEYS.INTRO.JOB)}
          </h2>
          <p className="mt-6 text-lg max-lg:max-w-md sm:text-xl md:mt-8">
            <Trans i18nKey={KEYS.INTRO.DESC}>
              0 <br />2
            </Trans>
          </p>
        </div>

        <Navbar />

        <div className="mt-auto flex flex-col gap-7 lg:w-full">
          <LanguageSwitcher
            className={`transition-transform duration-300 max-lg:hidden ${isContactInView ? "translate-y-20" : "delay-300"}`}
          />

          <ButtonContainer isContactInView={isContactInView} />
        </div>
      </div>
    </header>
  );
};

export default Header;
