import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

type ButtonContainerProps = {
  showText: boolean;
};

const ButtonContainer = ({ showText }: ButtonContainerProps) => {
  const { t } = useTranslation();

  return (
    <div className="">
      <a href="mailto:hi@dudeldups.dev" className="btn">
        <MdOutlineEmail />
        {showText && <span>{t(KEYS.CONTACT.BUTTON)}</span>}
      </a>
      <a href="https://linkedin.com/in/arne-jacob/" className="btn">
        <FaLinkedin />
        {showText && <span>LinkedIn</span>}
      </a>
      <a href="https://github.com/Dudeldups" className="btn">
        <FaGithub />
        {showText && <span>GitHub</span>}
      </a>
    </div>
  );
};

export default ButtonContainer;
