import { useState } from "react";
import checkedImg from "./img/checked.svg";
import uncheckedImg from "./img/unchecked.svg";
import "./styles/CreateClan.css";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { useTranslation } from "react-i18next";

export function CreateClan() {
  const { t } = useTranslation();
  const [clanName, setClanName] = useState("");
  const [checked, setChecked] = useState(false);
  return (
    <div className="createClan">
      <div className="createClan__inputBlock-inputWrapper">
        <label
          htmlFor="newClanName"
          className="createClan__inputBlock-inputWrapper-label"
        >
          {t("partnersModal.clansTab.clanName")}:
        </label>

        <input
          id="newClanName"
          value={clanName}
          onChange={(e) => {
            setClanName(e.target.value);
          }}
          className={`createClan__inputBlock-input`}
        />
      </div>

      <div className="createClan__checkboxBlock">
        <div
          className="createClan__checkboxBlock-checkWrapper"
          onClick={() => {
            setChecked(!checked);
          }}
        >
          <img
            src={checked ? checkedImg : uncheckedImg}
            alt="check"
            className="createClan__checkboxBlock-checkWrapper-img"
          />
        </div>
        <div
          className="createClan__checkboxBlock-text"
          onClick={() => {
            setChecked(!checked);
          }}
        >
          {t("partnersModal.clansTab.sendInviteToPartners")}
        </div>
      </div>

      <CuttedButton
        className={`createClan__createBtn ${clanName ? "" : "halfTransparent"}`}
        text={t("partnersModal.clansTab.createClan")}
        size="small"
        callback={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
}
