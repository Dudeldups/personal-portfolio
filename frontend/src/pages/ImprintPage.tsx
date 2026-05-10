import { useTranslation } from "react-i18next";
import LegalLayout from "../components/Legal/LegalLayout";
import { siteConfig } from "../config/site";

const ImprintPage = () => {
  const { t } = useTranslation();

  return (
    <LegalLayout title={t("legal.imprint.title")}>
      <section>
        <h2>{t("legal.imprint.providerTitle")}</h2>
        <div className="mt-6 space-y-1">
          {siteConfig.legalName ? <p>{siteConfig.legalName}</p> : null}
          {siteConfig.legalAddressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {siteConfig.legalEmail ? (
            <p>
              {t("legal.imprint.emailLabel")}:{" "}
              <a
                className="text-primary hover:underline"
                href={`mailto:${siteConfig.legalEmail}`}
              >
                {siteConfig.legalEmail}
              </a>
            </p>
          ) : null}
        </div>
      </section>

      <section>
        <h2>{t("legal.imprint.responsibleTitle")}</h2>
        {siteConfig.legalName ? <p className="mt-6">{siteConfig.legalName}</p> : null}
      </section>
    </LegalLayout>
  );
};

export default ImprintPage;
