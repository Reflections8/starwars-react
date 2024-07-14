import "../../styles/Info.css";
import infoIcon from "../../../../pages/home/img/info.svg";
import cornerImg from "../../../../pages/home/img/corner.svg";
import skullImg from "./img/broken-skull.svg";
import batteryImg from "./img/battery.svg";
import reloadImg from "./img/reload.svg";
import { useState } from "react";

type InfoProps = {
  damage: number;
  charge: number;
  reload: number;
};

export function Info({ damage, charge, reload }: InfoProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="info">
      <div
        className="info__button"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <img src={cornerImg} alt="corner" className="info__button-corner--1" />
        <img src={cornerImg} alt="corner" className="info__button-corner--2" />
        <img src={cornerImg} alt="corner" className="info__button-corner--3" />
        <img src={cornerImg} alt="corner" className="info__button-corner--4" />

        <img src={infoIcon} alt="info" className="info__button-icon" />
        <div className="info__button-text">инфо</div>
      </div>
      <div className={`info__menu ${menuOpen ? "info__menu--Active" : ""}`}>
        <div className="info__menu-title">текущие характеристики</div>
        <div className="info__menu-list">
          {/* ITEM */}
          <div className="info__menu-list-item">
            <img
              src={skullImg}
              alt="skull"
              className="info__menu-list-item-icon"
            />
            <div className="info__menu-list-item-info">
              <div className="info__menu-list-item-info-key">урон:</div>
              <div className="info__menu-list-item-info-value">
                {damage} ед.
              </div>
            </div>
          </div>

          {/* ITEM */}
          <div className="info__menu-list-item">
            <img
              src={batteryImg}
              alt="battery"
              className="info__menu-list-item-icon"
            />
            <div className="info__menu-list-item-info">
              <div className="info__menu-list-item-info-key">заряд:</div>
              <div className="info__menu-list-item-info-value">{reload}</div>
            </div>
          </div>

          {/* ITEM */}
          <div className="info__menu-list-item">
            <img
              src={reloadImg}
              alt="reload"
              className="info__menu-list-item-icon"
            />
            <div className="info__menu-list-item-info">
              <div className="info__menu-list-item-info-key">перезарядка:</div>
              <div className="info__menu-list-item-info-value">
                {charge}%/мин
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
