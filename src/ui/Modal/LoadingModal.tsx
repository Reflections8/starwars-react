/* eslint-disable @typescript-eslint/ban-ts-comment */
import textureBg from "./img/bg-texture.svg";
import bgImg from "./img/loader/loader-bg.png";
import greenBorder from "./img/loader/green-circle.svg";
import outerBorder from "./img/loader/outer-border.svg";
import innerBorder from "./img/loader/inner-border.svg";
import planet from "./img/loader/planet.png";
import "./styles/loadingModal.css";
import { useEffect } from "react";

type LoadingModalProps = {
  isOpen?: boolean;
  className?: string;
};

export function LoadingModal({ isOpen, className }: LoadingModalProps) {
  useEffect(() => {
    const green = document.querySelector(".loadingModal__loader-green");
    const outer = document.querySelector(".loadingModal__loader-outer");
    const inner = document.querySelector(".loadingModal__loader-inner");
    const planet = document.querySelector(".loadingModal__loader-planet");

    [green, outer, inner, planet].forEach((item) => {
      item?.classList.remove("animationPaused");
    });
  }, []);
  return (
    <div
      className={`loadingModalBg ${!isOpen ? "loadingModalBg--Hidden" : ""} ${
        className ?? ""
      }`}
    >
      <div className="loadingModalBg__color"></div>
      <img src={bgImg} alt="bg" className="loadingModalBg__img" />
      <img
        src={textureBg}
        alt="texture"
        className="loadingModalBg__textureBg loadingModalBg__textureBg--Left"
      />
      <img
        src={textureBg}
        alt="texture"
        className="loadingModalBg__textureBg loadingModalBg__textureBg--Right"
      />

      <div className="loadingModal">
        <div className="loadingModal__title">Загрузка галактики</div>
        <div className="loadingModal__dots">...</div>

        <div className="loadingModal__loader">
          <img
            src={greenBorder}
            alt="green"
            className="loadingModal__loader-green animationPaused"
          />
          <img
            src={outerBorder}
            alt="green"
            className="loadingModal__loader-outer animationPaused"
          />
          <img
            src={innerBorder}
            alt="green"
            className="loadingModal__loader-inner animationPaused"
          />
          <img
            src={planet}
            alt=""
            className="loadingModal__loader-planet animationPaused"
          />
        </div>
      </div>
    </div>
  );
}
