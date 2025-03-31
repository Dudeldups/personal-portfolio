import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import ButtonContainer from "../ButtonContainer/ButtonContainer";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="section mx-auto w-full max-w-page px-page">
      <div>
        <hgroup className="text-center">
          <h2>{t(KEYS.CONTACT.TITLE)}</h2>
          <p>{t(KEYS.CONTACT.DESC)}</p>
        </hgroup>

        <ButtonContainer showText={true} />
      </div>
    </section>
  );
};

export default Contact;
