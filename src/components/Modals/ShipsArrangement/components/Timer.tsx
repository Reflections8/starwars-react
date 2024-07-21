import { useEffect, useState } from "react";
import timerBg from "../img/timer-bg.svg";
import timerIcon from "../img/timer-icon.svg";

const initialSeconds = 60;
export function Timer() {
  const [time, setTime] = useState(initialSeconds * 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 5 : 0));
    }, 1);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    if (seconds < 10) {
      return `0${seconds}:${ms.toString().padStart(3, "0")}`;
    }
    return `${seconds}:${ms.toString().padStart(3, "0")}`;
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
          {formatTime(time)}
        </div>
      </div>
      <img
        src={timerBg}
        alt="timerBg"
        className="shipsArr__main-field-timerRow-bg"
      />
    </div>
  );
}
