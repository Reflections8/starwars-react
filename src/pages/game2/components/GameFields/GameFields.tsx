import "./styles/GameFields.css";
import boardBgTop from "./img/board-bg-top.svg";
import boardBgBottom from "./img/board-bg-bottom.svg";
import { Timer } from "../../../../components/Modals/ShipsArrangement2/components/Timer";

export function GameFields() {
  return (
    <div className="gameFields">
      {/* TOP WRAPPER */}
      <div className="gameFields__top">
        <img src={boardBgTop} alt="" className="gameFields__top-bg" />

        <div className="gameFields__top-board"></div>
      </div>
      {/* TIMER WRAPPER */}
      <div className="gameFields__timer">
        <Timer />
      </div>

      {/* BOTTOM WRAPPER */}
      <div className="gameFields__bottom">
        <img src={boardBgBottom} alt="" className="gameFields__bottom-bg" />

        <div className="gameFields__bottom-board"></div>
      </div>
    </div>
  );
}
