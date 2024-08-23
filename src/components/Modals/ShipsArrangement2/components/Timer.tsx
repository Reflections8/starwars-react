import { FC, useEffect, useState } from "react";
import timerBg from "../img/timer-bg.svg";
import timerIcon from "../img/timer-icon.svg";
import { useTimer } from "react-use-precision-timer";

const initialSeconds = 60;
const startSeconds = 5;
export const Timer: FC<{ onStart: () => void; onRandom: () => void }> = ({
  onRandom,
  onStart,
}) => {
  const [timerValue, setTimerValue] = useState(initialSeconds * 1000);
  const [isInitial, setIsInitial] = useState(true);

  const timer = useTimer(
    { runOnce: true, startImmediately: false, delay: initialSeconds * 1000 },
    () => {
      setIsInitial(false);
      startTimer.start();
      onRandom();
      //
    }
  );

  const startTimer = useTimer(
    { runOnce: true, startImmediately: false, delay: startSeconds * 1000 },
    onStart
  );

  useEffect(() => {
    let interval: any;
    if (isInitial) {
      timer.start();
      interval = setInterval(() => {
        setTimerValue(timer.getRemainingTime());
      }, 1);
    } else {
      interval = setInterval(() => {
        setTimerValue(startTimer.getRemainingTime());
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
