import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import ButtonContainer from "../ButtonContainer/ButtonContainer";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="w-full">
      <div>
        <h2>{t(KEYS.CONTACT.TITLE)}</h2>

        <div>
          <p>{t(KEYS.CONTACT.DESC)}</p>
        </div>

        <ButtonContainer showText={true} />
      </div>
    </section>
  );
};

export default Contact;
