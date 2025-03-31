import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

type ButtonContainerProps = {
  showText: boolean;
  className?: string;
};

const ButtonContainer = ({ showText, className }: ButtonContainerProps) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <a href="mailto:hi@dudeldups.dev" className="btn flex items-center gap-2">
        <MdOutlineEmail className="text-2xl text-darkest" />
        {showText && (
          <span className="text-darkest">{t(KEYS.CONTACT.BUTTON)}</span>
        )}
      </a>
      <a
        href="https://linkedin.com/in/arne-jacob/"
        className="btn flex items-center gap-2"
      >
        <FaLinkedin className="text-2xl text-darkest" />
        {showText && <span className="text-darkest">LinkedIn</span>}
      </a>
      <a
        href="https://github.com/Dudeldups"
        className="btn flex items-center gap-2"
      >
        <FaGithub className="text-2xl text-darkest" />
        {showText && <span className="text-darkest">GitHub</span>}
      </a>
    </div>
  );
};

export default ButtonContainer;
