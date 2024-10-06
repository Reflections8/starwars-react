import { useTranslation } from "react-i18next";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import "./Repair.css";
import { useState } from "react";

export function Repair() {
  const { t } = useTranslation();
  const [weaponName] = useState("MOCK NAME");
  return (
    <div className="repair">
      <div className="repair__textBlock">
        <p className="repair__textBlock-item">
          <span>{t("repairModal.text1")}</span>
          <span> ({weaponName}) </span>
          <span>{t("repairModal.text2")}</span>
        </p>
      </div>
      <CuttedButton
        className="repair__button"
        text={t("repairModal.buttonText")}
        callback={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
}
