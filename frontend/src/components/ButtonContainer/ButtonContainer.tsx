import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

type ButtonContainerProps = {
  hideText: boolean;
  hasRoundedButtons?: boolean;
  className?: string;
};

const ButtonContainer = ({
  hideText,
  className,
  hasRoundedButtons,
}: ButtonContainerProps) => {
  const { t } = useTranslation();

  return (
    <ul className={className}>
      <li>
        <a
          href="mailto:hi@dudeldups.dev"
          className={`btn flex items-center gap-2 ${hasRoundedButtons ? "aspect-square rounded-full" : ""}`}
        >
          <MdOutlineEmail className="text-2xl text-darkest" />

          <span className={`text-darkest ${hideText ? "hidden" : ""}`}>
            {t(KEYS.CONTACT.BUTTON)}
          </span>
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://linkedin.com/in/arne-jacob/"
          className={`btn flex items-center gap-2 ${hasRoundedButtons ? "aspect-square rounded-full" : ""}`}
        >
          <FaLinkedin className="text-2xl text-darkest" />
          <span className={`text-darkest ${hideText ? "hidden" : ""}`}>
            LinkedIn
          </span>
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Dudeldups"
          className={`btn flex items-center gap-2 ${hasRoundedButtons ? "aspect-square rounded-full" : ""}`}
        >
          <FaGithub className="text-2xl text-darkest" />
          <span className={`text-darkest ${hideText ? "hidden" : ""}`}>
            GitHub
          </span>
        </a>
      </li>
    </ul>
  );
};

export default ButtonContainer;
