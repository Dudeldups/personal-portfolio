import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="max-lg:hidden">
      <ul className="flex flex-col gap-3">
        <li className="flex items-center gap-5">
          <span className="h-0.5 w-10 bg-white"></span>
          <a href="#about">{t(KEYS.NAV.ABOUT)}</a>
        </li>
        <li className="flex items-center gap-5">
          <span className="h-0.5 w-10 bg-white"></span>
          <a href="#projects">{t(KEYS.NAV.PROJECTS)}</a>
        </li>
        <li className="flex items-center gap-5">
          <span className="h-0.5 w-10 bg-white"></span>
          <a href="#contact">{t(KEYS.NAV.CONTACT)}</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
