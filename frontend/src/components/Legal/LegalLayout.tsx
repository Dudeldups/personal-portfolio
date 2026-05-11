import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Header/LanguageSwitcher";
import Footer from "../Footer/Footer";

type LegalLayoutProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

const LegalLayout = ({ title, intro, children }: LegalLayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-darkest">
      <header className="border-b border-dark-light px-page">
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 py-6">
          <Link
            to="/"
            className="font-oswald text-2xl font-semibold text-white transition-colors hover:text-primary"
          >
            Arne Jacob
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden gap-4 sm:flex">
              <Link to="/" className="transition-colors hover:text-primary">
                {t("legal.backHome")}
              </Link>
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
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 px-page py-14">
        <article className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl">{title}</h1>
          {intro ? <p className="mt-6 max-w-3xl text-lg">{intro}</p> : null}
          <div className="legal-wrapper mt-10 space-y-10">{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default LegalLayout;
