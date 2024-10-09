import "./styles/BattleshipsLost.css";
import bg from "./img/bg.png";
import textImg from "./img/text.svg";
import textImgEng from "./img/text-eng.svg";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { useModal } from "../../../context/ModalContext";
import {
  gameStates,
  useBattleships,
} from "../../../context/BattleshipsContext";
import { useTranslation } from "react-i18next";

export function BattleshipsLost() {
  const { t, i18n } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { setGameState, betAmount, betType } = useBattleships();

  const betTypeObject = {
    "0": "CREDITS",
    "1": "AKRON",
    "2": "TON",
  };
  return (
    <div className="battleshipsLost">
      <img src={bg} alt="" className="battleshipsLost__bg" />
      <img
        src={i18n.language === "en" ? textImgEng : textImg}
        alt=""
        className="battleshipsLost__textImg"
      />

      <div className="battleshipsWon__text">
        <div className="battleshipsWon__text-key">
          {t("battleships.yourLoss")}:
        </div>
        <div className="battleshipsWon__text-value">
          {betAmount || 0}{" "}
          {betTypeObject[String(betType) as keyof typeof betTypeObject]}
        </div>
      </div>

      <CuttedButton
        className="battleshipsLost__okBtn"
        size="small"
        text="OK"
        callback={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeModal!();
          setGameState(gameStates.NOT_STARTED);
          openModal!("seaBattle");
        }}
      />
    </div>
  );
}
