import { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { useBattleships } from "../../context/BattleshipsContext";
import { useDrawer } from "../../context/DrawerContext";
import { useModal } from "../../context/ModalContext";
import { LeaveIcon } from "../../icons/Leave";
import { RulesIcon } from "../../icons/Rules";
import { EnemyShips } from "./components/EnemyShips/EnemyShips";
import { GameBet } from "./components/GameBet/GameBet";

import { GameFields } from "./components/GameFields/GameFields";
import { GameHeader } from "./components/GameHeader/GameHeader";

import "./styles/game2.css";
//@ts-ignore
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../context/SeaContexts";
//@ts-ignore
import { enableDragDropTouch } from "../../mobileDrag";
import { useUserData } from "../../UserDataService";
import audioBg from "./audio/game.mp3";
import audioKilledShot from "./audio/shot-killed.mp3";
import audioMissedShot from "./audio/shot-missed.mp3";
import audioSuccessShot from "./audio/shot-success.mp3";
import audioShot from "./audio/shot.mp3";
enableDragDropTouch();

const timerSeconds = 30;

let jwtToUse = localStorage.getItem("auth_jwt") || "";
if (document.location.href.includes("5174"))
  jwtToUse =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiVVFBaXFIZkg5NnpHSUMzOG9OUnMxQVdIUnluM3JzalQxek9pQVlmalE0TktOX1BwIiwiZXhwIjoxNzI2OTE1MjQyLCJpc3MiOiJBa3Jvbml4IEF1dGgifQ.96N5LMUaufEMXhsLSkHqOntGO6TBNApeEbr9OGdid2U";

export function Game2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const { openDrawer } = useDrawer();

  const {
    audioBgRef,
    shotAudioRef,
    shotSuccessAudioRef,
    shotMissAudioRef,
    shotKilledAudioRef,
  } = useSound();

  const { jwt: userDataJwt } = useUserData();

  const { myBoardState, userBoard, enemyBoard, myTurn, handshakeTimer } =
    useBattleships();

  useEffect(() => {
    if (!userDataJwt && !jwtToUse) {
      closeModal!();
      navigate("/");
      closeModal!();
      return;
    }
    openModal!("seaBattle");
  }, [userDataJwt]);

  const [timerValue, setTimerValue] = useState(timerSeconds * 1000);

  const resetTimer = (v: number) => {
    setTimerValue(0);
    setTimeout(() => {
      setTimerValue(v);
    }, 10);
  };

  useEffect(() => {
    resetTimer(timerSeconds * 1000);
  }, [myTurn]);
  //change from 60 to 1 and then back to 60
  useEffect(() => {
    if (myBoardState.ships && myBoardState.ships.length > 0)
      resetTimer(timerSeconds * 1000);
  }, [JSON.stringify(myBoardState)]);

  useEffect(() => {
    if (handshakeTimer.state === 5 || handshakeTimer.state === 6) {
      setTimeout(() => {
        resetTimer(handshakeTimer.time * 1000);
      }, 200);
    }
  }, [handshakeTimer]);

  return (
    <div className="game2">
      {/* AUDIO */}
      <audio
        ref={audioBgRef}
        src={audioBg}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotAudioRef}
        src={audioShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotSuccessAudioRef}
        src={audioSuccessShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotMissAudioRef}
        src={audioMissedShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <audio
        ref={shotKilledAudioRef}
        src={audioKilledShot}
        style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
      />
      <div className="game2__gradientTop"></div>
      <div className="game2__gradientBottom"></div>
      <GameHeader myTurn={myTurn} />
      <EnemyShips ships={enemyBoard.getShipsRemain()} />
      <GameFields
        {...{
          timerValue,
          enemyBoard,
          userBoard,
          myTurn,
        }}
      />
      <GameBet />

      <Header
        position={"bottom"}
        leftIcon={<RulesIcon />}
        leftText={t("battleships.rules")}
        leftAction={() => {
          openModal!("rules");
        }}
        rightIcon={<LeaveIcon />}
        rightText={t("battleships.giveUp")}
        rightAction={() => {
          openDrawer!("giveUp");
        }}
      />
    </div>
  );
}
