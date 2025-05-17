import { Trans, useTranslation } from "react-i18next";
import ButtonContainer from "../ButtonContainer/ButtonContainer";
import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";
import { KEYS } from "../../i18n/KEYS";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

const Header = () => {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <header className={`top-0 w-full shrink-[1.25] px-page lg:sticky`}>
      <div className="flex w-full flex-col items-center py-6 lg:min-h-screen lg:items-start lg:pb-14">
        <LanguageSwitcher className="self-end lg:hidden" />

        <div
          className={`mt-8 mb-12 text-center transition-transform delay-500 lg:text-left ${isScrolled ? "-translate-y-10" : ""}`}
        >
          <h1 className="">
            <Trans i18nKey={KEYS.INTRO.TITLE}>
              <span
                className={`inline-block transition-transform delay-500 ${isScrolled ? "-translate-y-60" : ""}`}
              >
                0
              </span>
              <br />
              <span className="underline decoration-primary">2</span>
              <span
                className={`inline-block transition-transform delay-500 ${isScrolled ? "-translate-y-60" : ""}`}
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

        <div className="mt-auto flex items-end lg:w-full lg:justify-between">
          <ButtonContainer
            hideText={true}
            hasRoundedButtons={true}
            className="flex gap-6"
          />

          <LanguageSwitcher className="max-lg:hidden" />
        </div>
      </div>
    </header>
  );
};

export default Header;
