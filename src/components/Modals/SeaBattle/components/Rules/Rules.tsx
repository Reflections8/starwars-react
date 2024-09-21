import { useTranslation } from "react-i18next";
import "./styles/Rules.css";

export function Rules() {
  const { t } = useTranslation();
  return (
    <div className="rules">
      <p>{t("rulesModal.p1")}</p>
      <p>{t("rulesModal.p2")}</p>
      <p>{t("rulesModal.p3")}</p>
    </div>
  );
}
