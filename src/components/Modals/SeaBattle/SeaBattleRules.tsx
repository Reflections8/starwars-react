import { Rules } from "./components/Rules/Rules";
import rulesCornerImg from "./img/rules-button-corner.svg";
import rulesImg from "./img/rules-button.svg";
import "./styles/SeaBattle.css";

export function SeaBattleRules() {
  return (
    <div className="seaBattle">
      <div className="seaBattle__rulesButtonWrapper">
        <img
          src={rulesCornerImg}
          alt="rules-corner"
          className="seaBattle__rulesButtonWrapper-btn-corner--Left"
        />
        <img
          src={rulesImg}
          alt="rules"
          className="seaBattle__rulesButtonWrapper-btn"
        />
        <img
          src={rulesCornerImg}
          alt="rules-corner"
          className="seaBattle__rulesButtonWrapper-btn-corner--Right"
        />
      </div>
      <div className="modal__scrollContainer">
        <Rules />
      </div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
