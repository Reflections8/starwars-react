import { useEffect, useRef, useState } from "react";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import "./styles/Binks.css";
import video2 from "./video/2.mp4";
import video3File from "./video/3.mp4";

export function Binks() {
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);

  const [ready, setReady] = useState(false);
  const [video3, setVideo3] = useState(false);

  useEffect(() => {
    if (ready && !video3) {
      // @ts-ignore
      video2Ref.current.play().catch();
      // @ts-ignore
      video2Ref.current.muted = false;
    }

    if (video3) {
      // @ts-ignore
      video3Ref.current.play().catch();
      // @ts-ignore
      video3Ref.current.muted = false;
    }
  }, [ready, video3]);

  return (
    <div className="binks">
      {!ready ? (
        <div className="binks__text">
          Приветствую тебя в Акроникс, на вашем кошельке не обнаружено НФТ
          персонажей, возможно вы новобранец, поэтому Бингс проведет для вас
          обучение. Включите звук и слушайте внимательно
        </div>
      ) : null}

      {ready && !video3 ? (
        <CuttedButton
          text={"книжка"}
          size="small"
          className="binks__book"
          callback={(e) => {
            e.stopPropagation();
            setVideo3(true);
          }}
        />
      ) : null}

      {!video3 ? (
        <video
          src={video2}
          className={`binks__video2 ${!ready ? "binks__video2--Preview" : ""}`}
          ref={video2Ref}
          muted
        />
      ) : null}

      {video3 ? (
        <video
          src={video3File}
          loop
          className={`binks__video3`}
          ref={video3Ref}
          muted
        />
      ) : null}
      {!ready ? (
        <CuttedButton
          text={"Я готов"}
          size="small"
          className="binks__btnReady"
          callback={(e) => {
            e.stopPropagation();
            setReady(true);
          }}
        />
      ) : null}
    </div>
  );
}
