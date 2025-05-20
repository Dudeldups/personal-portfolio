import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import ButtonContainer from "../ButtonContainer/ButtonContainer";
import { useStoreRef } from "../../hooks/useStoreRef";

const Contact = () => {
  const { t } = useTranslation();
  const contactRef = useStoreRef("contact");

  return (
    <section ref={contactRef} id="contact" className="section w-full px-page">
      <div className="mx-auto flex w-full max-w-page flex-col gap-12 pb-10">
        <hgroup className="mx-auto text-center max-lg:max-w-[25rem] lg:text-left">
          <h2>{t(KEYS.CONTACT.TITLE)}</h2>
          <p>{t(KEYS.CONTACT.DESC)}</p>
        </hgroup>

        <ButtonContainer
          hideText={false}
          className="mx-auto flex min-w-40 flex-col gap-6"
        />
      </div>
    </section>
  );
};

export default Contact;
