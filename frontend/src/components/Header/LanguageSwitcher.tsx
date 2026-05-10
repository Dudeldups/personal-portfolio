import { useTranslation } from "react-i18next";
import { availableLanguages } from "../../i18n/i18n";
import { IoLanguage } from "react-icons/io5";

type LanguageSwitcherProps = {
  className?: string;
};

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) =>
    i18n.changeLanguage(event.target.value);

  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <IoLanguage className="shrink-0 text-lg text-light" aria-hidden="true" />
      <select
        onChange={changeLanguage}
        name="language"
        id="language-select"
        value={i18n.language}
        aria-label={t("general.switcherLabel")}
        className="cursor-pointer bg-transparent"
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
