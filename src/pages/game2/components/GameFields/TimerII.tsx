import { FC } from "react";
import timerBg from "../../../../components/Modals/ShipsArrangement2/img/timer-bg.svg";
import timerIcon from "../../../../components/Modals/ShipsArrangement2/img/timer-icon.svg";

export const TimerII: FC<{
  timerValue: number;
}> = ({ timerValue }) => {
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
