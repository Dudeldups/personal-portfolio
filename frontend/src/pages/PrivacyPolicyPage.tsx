import { useTranslation } from "react-i18next";
import LegalLayout from "../components/Legal/LegalLayout";
import { siteConfig } from "../config/site";

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <LegalLayout title={t("legal.privacy.title")}>
      <section>
        <h2>{t("legal.privacy.generalTitle")}</h2>
        <p className="mt-6">{t("legal.privacy.generalBody")}</p>
      </section>

      <section>
        <h2>{t("legal.privacy.controllerTitle")}</h2>
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
        <h2>{t("legal.privacy.logsTitle")}</h2>
        <p className="mt-6">{t("legal.privacy.logsBody")}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>{t("legal.privacy.logsItems.ip")}</li>
          <li>{t("legal.privacy.logsItems.timestamp")}</li>
          <li>{t("legal.privacy.logsItems.page")}</li>
          <li>{t("legal.privacy.logsItems.browser")}</li>
          <li>{t("legal.privacy.logsItems.os")}</li>
        </ul>
        <p className="mt-4">{t("legal.privacy.logsLegalBasis")}</p>
      </section>

      <section>
        <h2>{t("legal.privacy.analyticsTitle")}</h2>
        <p className="mt-6">{t("legal.privacy.analyticsBody")}</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-semibold text-white">
              {t("legal.privacy.analyticsCollectedTitle")}
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>{t("legal.privacy.analyticsItems.pages")}</li>
              <li>{t("legal.privacy.analyticsItems.referrer")}</li>
              <li>{t("legal.privacy.analyticsItems.browserDevice")}</li>
              <li>{t("legal.privacy.analyticsItems.geo")}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">
              {t("legal.privacy.analyticsSecurityTitle")}
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>{t("legal.privacy.analyticsSecurityItems.noCookies")}</li>
              <li>{t("legal.privacy.analyticsSecurityItems.noProfiles")}</li>
              <li>{t("legal.privacy.analyticsSecurityItems.noThirdParty")}</li>
              <li>{t("legal.privacy.analyticsSecurityItems.anonymized")}</li>
            </ul>
          </div>
        </div>
        <p className="mt-4">{t("legal.privacy.analyticsLegalBasis")}</p>
      </section>

      <section>
        <h2>{t("legal.privacy.languageTitle")}</h2>
        <p className="mt-6">{t("legal.privacy.languageBody")}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>{t("legal.privacy.languageItems.storage")}</li>
          <li>{t("legal.privacy.languageItems.purpose")}</li>
          <li>{t("legal.privacy.languageItems.duration")}</li>
        </ul>
        <p className="mt-4">{t("legal.privacy.languageLegalBasis")}</p>
      </section>

      <section>
        <h2>{t("legal.privacy.linksTitle")}</h2>
        <p className="mt-6">{t("legal.privacy.linksBody")}</p>
      </section>

      <section>
        <h2>{t("legal.privacy.rightsTitle")}</h2>
        <ul className="mt-6 list-disc space-y-2 pl-5">
          <li>{t("legal.privacy.rightsItems.access")}</li>
          <li>{t("legal.privacy.rightsItems.rectification")}</li>
          <li>{t("legal.privacy.rightsItems.erasure")}</li>
          <li>{t("legal.privacy.rightsItems.restriction")}</li>
          <li>{t("legal.privacy.rightsItems.objection")}</li>
        </ul>
        <p className="mt-4">{t("legal.privacy.rightsBody")}</p>
      </section>

      <section>
        <h2>{t("legal.privacy.changesTitle")}</h2>
        <p className="mt-6">{t("legal.privacy.changesBody")}</p>
      </section>

      {siteConfig.privacyUpdatedAt ? (
        <section>
          <h2>{t("legal.privacy.updatedTitle")}</h2>
          <p className="mt-6">{siteConfig.privacyUpdatedAt}</p>
        </section>
      ) : null}
    </LegalLayout>
  );
};

export default PrivacyPolicyPage;
