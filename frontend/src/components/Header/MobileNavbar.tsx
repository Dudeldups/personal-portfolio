import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import MobileLanguageSwitcher from "./MobileLanguageSwitcher";

const MobileNavbar = () => {
  const { t } = useTranslation();

  return (
    <div className="lg:hidden">
      <nav className="">
        <ul className="flex flex-col">
          <li className="py-3 not-first:border-t-2 not-first:border-t-accent">
            <a href="#">{t(KEYS.NAV.HOME)}</a>
          </li>
          <li className="py-3 not-first:border-t-2 not-first:border-t-accent">
            <a href="#about">{t(KEYS.NAV.ABOUT)}</a>
          </li>
          <li className="py-3 not-first:border-t-2 not-first:border-t-accent">
            <a href="#projects">{t(KEYS.NAV.PROJECTS)}</a>
          </li>
          <li className="py-3 not-first:border-t-2 not-first:border-t-accent">
            <a href="#contact">{t(KEYS.NAV.CONTACT)}</a>
          </li>
        </ul>
      </nav>

      <MobileLanguageSwitcher />
    </div>
  );
};

export default MobileNavbar;
