/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import game1Icon from "./img/game1.svg";
import game1Bg from "./img/game1-bg.png";
import game2Icon from "./img/game2.svg";
import game2Bg from "./img/game2-bg.png";
import "./styles/chooseGame.css";
import { useNavigate } from "react-router-dom";

export function ChooseGame() {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  function openGame(linkToGame: string) {
    //@ts-ignore
    closeModal();
    navigate(linkToGame);
  }

  return (
    <div className="chooseGame">
      <div className="chooseGame__game">
        <div className="chooseGame__game-main">
          <img
            src={game1Bg}
            alt="game-1-bg"
            className="chooseGame__game-main-bg"
          />
          <img
            src={game1Icon}
            alt="game-1"
            className="chooseGame__game-main-icon"
          />
          <div className="chooseGame__game-main-text">Вейдер</div>
        </div>
        <CuttedButton
          text="Играть"
          size="small"
          callback={() => {
            openGame("/game1");
          }}
        />
      </div>

      <div className="chooseGame__game">
        <div className="chooseGame__game-main">
          <img
            src={game2Bg}
            alt="game-2-bg"
            className="chooseGame__game-main-bg"
          />
          <img
            src={game2Icon}
            alt="game-2"
            className="chooseGame__game-main-icon"
          />
          <div className="chooseGame__game-main-text">Морской бой</div>
        </div>
        <CuttedButton
          text="Играть"
          size="small"
          callback={() => {
            openGame("/game2");
          }}
        />
      </div>
    </div>
  );
}
