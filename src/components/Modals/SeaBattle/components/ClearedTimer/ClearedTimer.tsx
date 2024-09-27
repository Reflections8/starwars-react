import { FC, useEffect, useState } from "react";
import timerBg from "./img/timer-bg.svg";
import timerIcon from "./img/timer-icon.svg";

const initialSeconds = 60 * 1000;

export const ClearedTimer: FC<{
  remainTime: number;
  callback: () => void;
}> = ({ remainTime, callback }) => {
  const [localRemainTime, setLocalRemainTime] = useState(
    remainTime ?? initialSeconds
  );

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    let s: any = seconds % 60;
    let m: any = minutes;
    m = m.toString().length === 1 ? `0${m}` : m;
    s = s.toString().length === 1 ? `0${s}` : s;
    return `${m}:${s}`;
  };

  useEffect(() => {
    let timer;

    // @ts-ignore
    timer = setInterval(() => {
      setLocalRemainTime(localRemainTime - 1000);
    }, 1000);

    if (localRemainTime === 0) {
      clearInterval(timer);
      setLocalRemainTime(0);
      callback();
    }

    return () => {
      clearInterval(timer);
    };
  }, [localRemainTime]);

  useEffect(() => {
    setLocalRemainTime(remainTime);
  }, [remainTime]);

  return (
    <div className="shipsArr__main-field-timerRow">
      <div className="shipsArr__main-field-timerRow-content">
        <img
          src={timerIcon}
          alt="timer"
          className="shipsArr__main-field-timerRow-content-icon"
        />
        <div className="shipsArr__main-field-timerRow-content-value">
          {formatTime(localRemainTime)}
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
