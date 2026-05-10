import { useTranslation } from "react-i18next";
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

type ButtonContainerProps = {
  isContactInView: boolean;
};

const ButtonContainer = ({ isContactInView }: ButtonContainerProps) => {
  const { t } = useTranslation();

  return (
    <ul
      className={`flex gap-6 transition-all duration-300 ${isContactInView ? "translate-y-40 opacity-0" : "delay-300"}`}
    >
      <li>
        <a
          href="mailto:hi@dudeldups.dev"
          className={`flex size-12 items-center justify-center rounded-full border-2 border-light text-light transition-colors duration-300 ease-in-out hocus-visible:border-primary hocus-visible:text-primary`}
          title="Email"
        >
          <MdOutlineEmail className="text-xl" />

          <span className={`hidden`}>{t("contact.button")}</span>
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://linkedin.com/in/arne-jacob/"
          className={`flex size-12 items-center justify-center rounded-full border-2 border-light text-light transition-colors duration-300 ease-in-out hocus-visible:border-primary hocus-visible:text-primary`}
          title="LinkedIn"
        >
          <FaLinkedin className="text-xl" />
          <span className={`hidden`}>LinkedIn</span>
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Dudeldups"
          className={`flex size-12 items-center justify-center rounded-full border-2 border-light text-light transition-colors duration-300 ease-in-out hocus-visible:border-primary hocus-visible:text-primary`}
          title="GitHub"
        >
          <FaGithub className="text-xl" />
          <span className={`hidden`}>GitHub</span>
        </a>
      </li>
    </ul>
  );
};

export default ButtonContainer;
