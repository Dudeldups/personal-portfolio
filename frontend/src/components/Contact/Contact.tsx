import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div>
        <h2>{t(KEYS.CONTACT.TITLE)}</h2>

        <div>
          <p>{t(KEYS.CONTACT.DESC)}</p>

          <div>
            <a href="mailto:hi@dudeldups.dev" className="btn">
              <MdOutlineEmail />
              <span>{t(KEYS.CONTACT.BUTTON)}</span>
            </a>
            <a href="https://linkedin.com/in/arne-jacob/" className="btn">
              <FaLinkedin />
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/Dudeldups" className="btn">
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
