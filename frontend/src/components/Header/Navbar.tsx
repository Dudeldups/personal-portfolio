import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="max-md:hidden">
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
  );
};

export default Navbar;
