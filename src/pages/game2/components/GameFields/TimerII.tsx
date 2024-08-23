import { FC } from "react";
import timerBg from "../../../../components/Modals/ShipsArrangement2/img/timer-bg.svg";
import timerIcon from "../../../../components/Modals/ShipsArrangement2/img/timer-icon.svg";

export const TimerII: FC<{
  timerValue: number;
}> = ({ timerValue }) => {
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
