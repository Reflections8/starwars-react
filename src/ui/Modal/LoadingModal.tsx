/* eslint-disable @typescript-eslint/ban-ts-comment */
import textureBg from "./img/bg-texture.svg";
import bgImg from "./img/loader/loader-bg.png";
import greenBorder from "./img/loader/green-circle.svg";
import outerBorder from "./img/loader/outer-border.svg";
import innerBorder from "./img/loader/inner-border.svg";
import planet from "./img/loader/planet.png";
import "./styles/loadingModal.css";

type LoadingModalProps = {
  isOpen: boolean;
};

export function LoadingModal({ isOpen }: LoadingModalProps) {
  return (
    <div
      className={`loadingModalBg ${!isOpen ? "loadingModalBg--Hidden" : ""}`}
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
            className="loadingModal__loader-green"
          />
          <img
            src={outerBorder}
            alt="green"
            className="loadingModal__loader-outer"
          />
          <img
            src={innerBorder}
            alt="green"
            className="loadingModal__loader-inner"
          />
          <img src={planet} alt="" className="loadingModal__loader-planet" />
        </div>
      </div>
    </div>
  );
}
