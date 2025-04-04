import { useTranslation } from "react-i18next";
import { availableLanguages } from "../../i18n/i18n";
import { KEYS } from "../../i18n/KEYS";
import { countries } from "country-flag-icons";

const MobileLanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLInputElement>) =>
    i18n.changeLanguage(event.target.value);

  return (
    <div className="lg:hidden">
      <form action="">
        <fieldset>
          <legend className="sr-only">{t(KEYS.GENERAL.SWITCHER_LABEL)}</legend>

          {Object.entries(availableLanguages).map(([code, name]) => {
            const flagCodes = {
              de: "DE",
              en: "US",
            };
            const flagCode = flagCodes[code as keyof typeof flagCodes];

            return (
              <label
                key={"label-" + code}
                className="flex cursor-pointer items-center gap-3"
              >
                {countries.includes(flagCode) && (
                  <img
                    src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${flagCode}.svg`}
                    className=""
                    width={40}
                    height={40}
                    alt=""
                    aria-hidden="true"
                  />
                )}
                <input
                  type="radio"
                  value={code}
                  checked={i18n.language === code}
                  onChange={changeLanguage}
                  className="hidden"
                />
                {name}
              </label>
            );
          })}
        </fieldset>
      </form>
    </div>
  );
};

export default MobileLanguageSwitcher;
