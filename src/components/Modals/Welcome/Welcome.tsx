import "./styles/Welcome.css";
import exchangeBadgeBgLeft from "./img/exchange-bg-left.svg";
import exchangeBadgeBgRight from "./img/exchange-bg-right.svg";
import badgeTon from "./img/exchange-ton.svg";
import badgeAkronix from "./img/exchange-akronix.svg";
import { useState } from "react";
import creditIcon from "./img/credit.svg";
import akronixIcon from "./img/akronix.svg";
import tonIcon from "./img/ton.svg";
import { Balance } from "../../../ui/Balance/Balance";
import { StoreCardModel } from "../Shop/components/StoreCard";
import model1Img from "./img/model1.png";
import footerBtnBg from "./img/footerButtonBg.svg";
import { useModal } from "../../../context/ModalContext";

export function Welcome() {
  const [credit] = useState(0);
  const [akron] = useState(0);
  const [ton] = useState(0);

  const { closeModal } = useModal();

  const model = {
    title: "-DROID-",
    needRestoration: true,
    combatPerfomanceReduction: null,
    strength: 5,
    strengthUpgrade: 2,
    reload: 5,
    reloadUpgrade: 1,
    charge: 500,
    chargeUpgrade: 500,
    healthCurrent: 1851,
    healthMax: 2000,
    imgSrc: model1Img,
    type: 1,
  };

  return (
    <div className="welcome">
      <div className="welcome__title">С возвращением на станцию!</div>
      <div className="welcome__main">
        <div className="welcome__main-balance">
          <Balance
            icon1={creditIcon}
            name1="Credit"
            value1={credit}
            icon2={akronixIcon}
            name2="Akron"
            value2={akron}
            icon3={tonIcon}
            name3="Ton"
            value3={ton}
          />
          <div className="welcome__main-balance-text">Заработано за вчера</div>
        </div>

        {/* EXCHANGE */}
        <div className="exchange__badge">
          <img
            src={exchangeBadgeBgLeft}
            alt="bg"
            className="exchange__badge-bg exchange__badge-bg--Left"
          />
          <img
            src={exchangeBadgeBgRight}
            alt="bg"
            className="exchange__badge-bg exchange__badge-bg--Right"
          />

          <div className="exchange__badge-item exchange__badge-item--Left">
            <div className="exchange__badge-item-name">
              <img
                src={badgeTon}
                alt="icon"
                className="exchange__badge-item-name-icon"
              />
              <div className="exchange__badge-item-name-value">credits</div>
            </div>

            <div className="exchange__badge-item-amount">1</div>
          </div>

          <div className="exchange__badge-item-equalsSign">=</div>

          <div className="exchange__badge-item exchange__badge-item--Right">
            <div className="exchange__badge-item-amount">750k</div>

            <div className="exchange__badge-item-name">
              <img
                src={badgeAkronix}
                alt="icon"
                className="exchange__badge-item-name-icon"
              />
              <div className="exchange__badge-item-name-value">akronix</div>
            </div>
          </div>
        </div>

        <StoreCardModel
          title={model.title}
          needRestoration={model.needRestoration}
          combatPerfomanceReduction={model.combatPerfomanceReduction}
          strength={model.strength}
          strengthUpgrade={model.strengthUpgrade}
          reload={model.reload}
          reloadUpgrade={model.reloadUpgrade}
          charge={model.charge}
          chargeUpgrade={model.chargeUpgrade}
          healthCurrent={model.healthCurrent <= 0 ? 0 : model.healthCurrent}
          healthMax={model.healthMax}
          imgSrc={model.imgSrc}
          type={model.type}
        />
      </div>
      <div
        className="welcome__btn"
        onClick={() => {
          closeModal!();
        }}
      >
        <div className="welcome__btn-content">{/* сюда текст кнопки */}</div>
        <img src={footerBtnBg} alt="bg" className="welcome__btn-bg" />
      </div>
    </div>
  );
}
