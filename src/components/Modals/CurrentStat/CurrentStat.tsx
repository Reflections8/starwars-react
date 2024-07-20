import { useState } from "react";
import { useModal } from "../../../context/ModalContext";

import playerModel from "./img/playerModel.png";
import weaponModel from "./img/weaponModel.png";
import footerBtnBg from "./img/footerButtonBg.svg";

import damageIcon from "./img/broken-skull.svg";
import chargeIcon from "./img/battery.svg";
import reloadIcon from "./img/reload.svg";

import "./styles/CurrentStat.css";

export function CurrentStat() {
  const [damage] = useState(5);
  const [damageUpgrade] = useState(2);

  const [charge] = useState(5);
  const [chargeUpgrade] = useState(4);

  const [reload] = useState(500);
  const [reloadUpgrade] = useState(500);

  const { closeModal } = useModal();

  return (
    <div className="currentStat">
      <div className="currentStat__title">Ваши текущие характеристики</div>
      <div className="currentStat__main">
        <div className="currentStat__main-images">
          <img
            src={playerModel}
            alt=""
            className="currentStat__main-images-img"
          />
          <img
            src={weaponModel}
            alt=""
            className="currentStat__main-images-img"
          />
        </div>

        <div className="currentStat__main-box">
          <div className="currentStat__main-box-title">
            характеристики комплекта:
          </div>
          <div className="currentStat__main-box-list">
            {/* ROW */}
            <div className="currentStat__main-box-list-row">
              <div className="currentStat__main-box-list-row-key">
                <img
                  src={damageIcon}
                  alt="icon"
                  className="currentStat__main-box-list-row-key-img"
                />
                <div className="currentStat__main-box-list-row-key-text">
                  Урон:
                </div>
              </div>
              <div className="currentStat__main-box-list-row-value">
                {damage} <span className="green">(+{damageUpgrade}) </span>Ед.
              </div>
            </div>

            {/* ROW */}
            <div className="currentStat__main-box-list-row">
              <div className="currentStat__main-box-list-row-key">
                <img
                  src={chargeIcon}
                  alt="icon"
                  className="currentStat__main-box-list-row-key-img"
                />
                <div className="currentStat__main-box-list-row-key-text">
                  Заряд:
                </div>
              </div>
              <div className="currentStat__main-box-list-row-value">
                {charge} <span className="green">(+{chargeUpgrade})%</span>/мин
              </div>
            </div>

            {/* ROW */}
            <div className="currentStat__main-box-list-row">
              <div className="currentStat__main-box-list-row-key">
                <img
                  src={reloadIcon}
                  alt="icon"
                  className="currentStat__main-box-list-row-key-img"
                />
                <div className="currentStat__main-box-list-row-key-text">
                  Перезарядка:
                </div>
              </div>
              <div className="currentStat__main-box-list-row-value">
                {reload} <span className="green">(+{reloadUpgrade}) </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="currentStat__btn"
        onClick={() => {
          closeModal!();
        }}
      >
        <div className="currentStat__btn-content">
          {/* сюда текст кнопки */}
        </div>
        <img src={footerBtnBg} alt="bg" className="currentStat__btn-bg" />
      </div>
    </div>
  );
}
