import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-page w-full">
      <div>
        <p>
          &copy; {currentYear} Arne Jacob - {t(KEYS.FOOTER.DISCLAIMER)}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
