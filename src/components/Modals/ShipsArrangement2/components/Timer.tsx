import { FC, useEffect, useState } from "react";
import timerBg from "../img/timer-bg.svg";
import timerIcon from "../img/timer-icon.svg";
import { useTimer } from "react-use-precision-timer";
import { useSound } from "../../../../context/SeaContexts";
import { useBattleships } from "../../../../context/BattleshipsContext";
import { useModal } from "../../../../context/ModalContext";

const initialSeconds = 60;

export const Timer: FC<{
  onRandom: () => void;
}> = ({ onRandom }) => {
  const [timerValue, setTimerValue] = useState(initialSeconds * 1000);
  const { isInitial, setMyBoardState, setBlockedState, gameboard } =
    useBattleships();
  const { closeModal } = useModal();
  const { setIsAudioStart } = useSound();

  const handleStartGame = () => {
    setMyBoardState((prev: any) => ({
      ...prev,
      ships: gameboard.ships.map((s: any) => {
        return {
          length: s.ship.length,
          vertical: s.ship.vertical,
          pos: s.pos,
        };
      }),
    }));
    setIsAudioStart(true);
    closeModal!();
    setBlockedState(false);
  };

  const startTimer = useTimer(
    { runOnce: true, startImmediately: false, delay: 5 * 1000 },
    handleStartGame
  );

  const timer = useTimer(
    { runOnce: true, startImmediately: false, delay: initialSeconds * 1000 },
    onRandom
  );
  useEffect(() => {
    let interval: any;
    if (isInitial) {
      timer.start();
      interval = setInterval(() => {
        setTimerValue(timer.getRemainingTime());
      }, 1);
    } else {
      timer.stop();
      startTimer.start();
      interval = setInterval(() => {
        startTimer && setTimerValue(startTimer.getRemainingTime());
      }, 1);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isInitial]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    let s: any = seconds % 60;
    let m: any = minutes;
    m = m.toString().length === 1 ? `0${m}` : m;
    s = s.toString().length === 1 ? `0${s}` : s;
    return `${m}:${s}`;
  };

  return (
    <div className="shipsArr__main-field-timerRow">
      <div className="shipsArr__main-field-timerRow-content">
        <img
          src={timerIcon}
          alt="timer"
          className="shipsArr__main-field-timerRow-content-icon"
        />
        <div className="shipsArr__main-field-timerRow-content-value">
          {formatTime(timerValue)}
        </div>
      </div>
      <img
        src={timerBg}
        alt="timerBg"
        className="shipsArr__main-field-timerRow-bg"
      />
    </div>
  );
};
