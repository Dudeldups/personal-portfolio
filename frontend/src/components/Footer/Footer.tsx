import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();
  const isHomePage = pathname === "/";

  return (
    <footer className="w-full px-page max-lg:bg-dark">
      <div className="mx-auto flex max-w-page flex-col gap-4 py-6 text-center lg:pb-14">
        <nav className="flex flex-wrap justify-center gap-4 text-sm">
          {!isHomePage ? (
            <Link to="/" className="transition-colors hover:text-primary">
              {t("legal.backHome")}
            </Link>
          ) : null}
          <Link
            to="/impressum"
            className="transition-colors hover:text-primary"
          >
            {t("legal.imprint.title")}
          </Link>
          <Link
            to="/datenschutz"
            className="transition-colors hover:text-primary"
          >
            {t("legal.privacy.title")}
          </Link>
        </nav>
        <p>
          &copy; {currentYear} Arne Jacob - {t("footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
