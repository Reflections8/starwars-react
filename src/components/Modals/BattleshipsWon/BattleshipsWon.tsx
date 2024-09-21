import "./styles/BattleshipsWon.css";
import bg from "./img/bg.png";
import textImg from "./img/text.svg";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { useModal } from "../../../context/ModalContext";
import { useBattleships } from "../../../context/BattleshipsContext";
import { useTranslation } from "react-i18next";

export function BattleshipsWon() {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { setGameState } = useBattleships();
  return (
    <div className="battleshipsWon">
      <img src={bg} alt="" className="battleshipsWon__bg" />
      <img src={textImg} alt="" className="battleshipsWon__textImg" />

      <div className="battleshipsWon__text">
        <div className="battleshipsWon__text-key">
          {t("battleships.yourWinnings")}:
        </div>
        <div className="battleshipsWon__text-value">1,235,954</div>
      </div>
      <CuttedButton
        className="battleshipsWon__okBtn"
        size="small"
        text="OK"
        callback={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // @ts-ignore
          setGameState((prevState) => ({
            ...prevState,
            status: "NOT_STARTED",
          }));
          closeModal!();
          openModal!("seaBattle");
        }}
      />
    </div>
  );
}
