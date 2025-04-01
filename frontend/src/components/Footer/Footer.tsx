import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-dark px-page">
      <div className="mx-auto max-w-page py-4 text-center md:py-6">
        <p>
          &copy; {currentYear} Arne Jacob - {t(KEYS.FOOTER.DISCLAIMER)}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
