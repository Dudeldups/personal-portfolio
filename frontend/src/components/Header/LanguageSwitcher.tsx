import { useTranslation } from "react-i18next";
import { availableLangeuages } from "../../i18n/i18n";
import { KEYS } from "../../i18n/KEYS";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) =>
    i18n.changeLanguage(event.target.value);

  return (
    <div>
      <select
        onChange={changeLanguage}
        name="language"
        id="language-select"
        value={i18n.language}
        aria-label={t(KEYS.GENERAL.SWITCHER_LABEL)}
      >
        {Object.entries(availableLangeuages).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
