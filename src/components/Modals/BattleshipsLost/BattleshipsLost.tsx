import "./styles/BattleshipsLost.css";
import bg from "./img/bg.png";
import textImg from "./img/text.svg";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { useModal } from "../../../context/ModalContext";
import { useBattleships } from "../../../context/BattleshipsContext";

export function BattleshipsLost() {
  const { openModal } = useModal();
  const { setGameState } = useBattleships();
  return (
    <div className="battleshipsLost">
      <img src={bg} alt="" className="battleshipsLost__bg" />
      <img src={textImg} alt="" className="battleshipsLost__textImg" />

      <CuttedButton
        className="battleshipsLost__okBtn"
        size="small"
        text="OK"
        callback={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setGameState("NOT_STARTED");
          openModal!("seaBattle");
        }}
      />
    </div>
  );
}
