import { useTranslation } from "react-i18next";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import "./Heal.css";
import { useState } from "react";

export function Heal() {
  const { t } = useTranslation();
  const [charaterName] = useState("MOCK NAME");
  return (
    <div className="heal">
      <div className="heal__textBlock">
        <p className="heal__textBlock-item">
          <span>{t("healModal.text1")}</span>
          <span> ({charaterName}) </span>
          <span>{t("healModal.text2")}</span>
        </p>
      </div>
      <CuttedButton
        className="heal__button"
        text={t("healModal.buttonText")}
        callback={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
}
