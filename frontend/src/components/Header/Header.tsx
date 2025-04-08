import { Trans, useTranslation } from "react-i18next";
import ButtonContainer from "../ButtonContainer/ButtonContainer";
import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";
import { KEYS } from "../../i18n/KEYS";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="top-0 w-full px-page lg:sticky">
      <div className="flex w-full flex-col items-center bg-slate-800 py-5 lg:min-h-screen">
        <LanguageSwitcher />

        <div className="mt-8 mb-12 text-center lg:text-left">
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
        </div>

        <Navbar />

        <ButtonContainer
          hideText={true}
          hasRoundedButtons={true}
          className="mt-auto flex items-center justify-center gap-6 md:justify-start"
        />
      </div>
    </header>
  );
};

export default Header;
