import { useTranslation } from "react-i18next";
import { availableLanguages } from "../../i18n/i18n";
import { KEYS } from "../../i18n/KEYS";

type LanguageSwitcherProps = {
  className?: string;
};

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) =>
    i18n.changeLanguage(event.target.value);

  return (
    <div className={className}>
      <select
        onChange={changeLanguage}
        name="language"
        id="language-select"
        value={i18n.language}
        aria-label={t(KEYS.GENERAL.SWITCHER_LABEL)}
        className="cursor-pointer"
      >
        {Object.entries(availableLanguages).map(([key, label]) => (
          <option key={key} value={key} className="bg-white text-darkest">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
