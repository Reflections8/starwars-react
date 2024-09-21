import { useTranslation } from "react-i18next";
import "./styles/tournament.css";

export function Tournament() {
  const { t } = useTranslation();
  return (
    <div className="tournament modalComingSoon">
      <div className="modalComingSoon__title">coming soon...</div>
      <div className="modalComingSoon__text">
        {t("tournamentsModal.comingSoonText")}
      </div>
    </div>
  );
}
