import { useTranslation } from "react-i18next";
import LegalLayout from "../components/Legal/LegalLayout";
import PageMetadata from "../components/Metadata/PageMetadata";
import { siteConfig } from "../config/site";

const ImprintPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageMetadata
        title={t("metadata.imprint.title")}
        description={t("metadata.imprint.description")}
        path="/impressum"
      />
      <LegalLayout title={t("legal.imprint.title")}>
        <section>
          <h2>{t("legal.imprint.providerTitle")}</h2>
          <address className="mt-6 space-y-1 not-italic">
            {siteConfig.legalName ? <p>{siteConfig.legalName}</p> : null}
            {siteConfig.legalAddressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {siteConfig.legalEmail ? (
              <p>
                {t("general.emailLabel")}:{" "}
                <a
                  className="text-primary hover:underline"
                  href={`mailto:${siteConfig.legalEmail}`}
                >
                  {siteConfig.legalEmail}
                </a>
              </p>
            ) : null}
          </address>
        </section>

        <section>
          <h2>{t("legal.imprint.responsibleTitle")}</h2>
          {siteConfig.legalName ? (
            <p className="mt-6">{siteConfig.legalName}</p>
          ) : null}
        </section>
      </LegalLayout>
    </>
  );
};

export default ImprintPage;
