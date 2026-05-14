import { useTranslation } from "react-i18next";
import { useStoreRef } from "../../hooks/useStoreRef";
import GithubUpdateCard from "./GithubUpdateCard";
import SpotifyUpdateCard from "./SpotifyUpdateCard";

const Updates = () => {
  const { t } = useTranslation();
  const updatesRef = useStoreRef("updates");

  return (
    <section ref={updatesRef} id="updates" className="section px-page">
      <div className="mx-auto flex w-full max-w-page flex-col gap-12">
        <hgroup className="mx-auto text-center max-lg:max-w-100 lg:text-left">
          <h2>{t("updates.title")}</h2>
          <p>{t("updates.desc")}</p>
        </hgroup>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15.5rem),1fr))] gap-6 *:w-full">
          <GithubUpdateCard />
          <SpotifyUpdateCard />
        </div>
      </div>
    </section>
  );
};

export default Updates;
