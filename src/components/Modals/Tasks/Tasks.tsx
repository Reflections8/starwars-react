import { useTranslation } from "react-i18next";
import "./styles/tasks.css";

export function Tasks() {
  const { t } = useTranslation();
  return (
    <div className="tasks modalComingSoon">
      <div className="modalComingSoon__title">coming soon...</div>
      <div className="modalComingSoon__text">
        {t("questsModal.comingSoonText")}
      </div>
    </div>
  );
}
