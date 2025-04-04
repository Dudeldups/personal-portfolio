import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden gap-5 lg:flex">
      <nav className="">
        <ul className="flex">
          <li className="px-3 not-first:border-l-2 not-first:border-l-accent">
            <a href="#">{t(KEYS.NAV.HOME)}</a>
          </li>
          <li className="px-3 not-first:border-l-2 not-first:border-l-accent">
            <a href="#about">{t(KEYS.NAV.ABOUT)}</a>
          </li>
          <li className="px-3 not-first:border-l-2 not-first:border-l-accent">
            <a href="#projects">{t(KEYS.NAV.PROJECTS)}</a>
          </li>
          <li className="px-3 not-first:border-l-2 not-first:border-l-accent">
            <a href="#contact">{t(KEYS.NAV.CONTACT)}</a>
          </li>
        </ul>
      </nav>

      <LanguageSwitcher />
    </div>
  );
};

export default Navbar;
