import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav>
      <ul>
        <li>
          <a href="/">{t(KEYS.NAV.HOME)}</a>
        </li>
        <li>
          <a href="/about">{t(KEYS.NAV.ABOUT)}</a>
        </li>
        <li>
          <a href="/projects">{t(KEYS.NAV.PROJECTS)}</a>
        </li>
        <li>
          <a href="/contact">{t(KEYS.NAV.CONTACT)}</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
