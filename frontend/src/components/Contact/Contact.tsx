import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import ButtonContainer from "../ButtonContainer/ButtonContainer";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="section w-full px-page">
      <div className="mx-auto w-full max-w-page pb-10">
        <hgroup className="mx-auto max-w-[25rem] text-center">
          <h2>{t(KEYS.CONTACT.TITLE)}</h2>
          <p>{t(KEYS.CONTACT.DESC)}</p>
        </hgroup>

        <ButtonContainer
          hideText={false}
          className="mx-auto mt-10 flex max-w-48 flex-col gap-6"
        />
      </div>
    </section>
  );
};

export default Contact;
