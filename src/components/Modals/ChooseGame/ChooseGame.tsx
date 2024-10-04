/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import game1Icon from "./img/game1.svg";
import game1Bg from "./img/game1-bg.png";
import game2Icon from "./img/game2.svg";
import game2Bg from "./img/game2-bg.png";
import "./styles/chooseGame.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {useUserData} from "../../../UserDataService.tsx";
import {useDrawer} from "../../../context/DrawerContext.tsx";

export function ChooseGame() {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { openDrawer } = useDrawer();
  const navigate = useNavigate();
  const {characters, blasters} = useUserData()
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
          <div className="chooseGame__game-main-text">
            {t("chooseGameModal.vader")}
          </div>
        </div>
        <CuttedButton
          text={t("chooseGameModal.play")}
          size="small"
          callback={() => {
            if(characters.length == 0) {
              openDrawer("rejected", "bottom", t("chooseGameModal.nonPlayableCh"))
              return;
            }
            if(blasters.length == 0) {
              openDrawer("rejected", "bottom", t("chooseGameModal.nonPlayableBl"))
              return;
            }
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
          <div className="chooseGame__game-main-text">
            {t("chooseGameModal.battleships")}
          </div>
        </div>
        <CuttedButton
          text={t("chooseGameModal.play")}
          size="small"
          callback={() => {
            openGame("/game2");
          }}
        />
      </div>
    </div>
  );
}
