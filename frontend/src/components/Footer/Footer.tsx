import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-page max-lg:bg-dark">
      <div className="mx-auto max-w-page py-6 text-center lg:pb-14">
        <p>
          &copy; {currentYear} Arne Jacob - {t(KEYS.FOOTER.DISCLAIMER)}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
