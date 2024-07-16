import { useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import "./styles/Statistic.css";
import avatarImg from "./img/ava.png";
import icon1 from "./img/1.svg";
import icon2 from "./img/2.svg";
import icon3 from "./img/3.svg";
import icon4 from "./img/4.svg";

import creditPlus from "./img/credit__plus.svg";
import creditMinus from "./img/credit__minus.svg";
import credit from "./img/credit.svg";

import akrPlus from "./img/akr__plus.svg";
import akrMinus from "./img/akr__minus.svg";
import akr from "./img/akr.svg";

import tonPlus from "./img/ton__plus.svg";
import tonMinus from "./img/ton__minus.svg";
import ton from "./img/ton.svg";

type CurrencyStatType = {
	[key: string]: {
		title: string
		plusIcon: string
		minusIcon: string
		totalIcon: string
	}
}

export function Statistic() {
  const [activeCurrency, setActiveCurrency] = useState("ton");

  const currencyStatEnum: CurrencyStatType = {
    credits: {
      title: "кредитов",
      plusIcon: creditPlus,
      minusIcon: creditMinus,
      totalIcon: credit,
    },
    akronix: {
      title: "akronix",
      plusIcon: akrPlus,
      minusIcon: akrMinus,
      totalIcon: akr,
    },
    ton: {
      title: "ton",
      plusIcon: tonPlus,
      minusIcon: tonMinus,
      totalIcon: ton,
    },
  };
  return (
    <div className="statistic">
      <CryptoButtons
        className="seaBattle__cryptoButtons"
        activeCurrency={activeCurrency}
        activeOptions={["credits", "akronix", "ton"]}
        setActiveCurrency={setActiveCurrency}
      />
      <div className="statistic__info">
        <div className="statistic__info-avatarBlock">
          <img
            src={avatarImg}
            alt="avatar"
            className="statistic__info-avatarBlock-img"
          />
        </div>

        <div className="statistic__info-divider"></div>

        <div className="statistic__info-login">@pashadurovofficial</div>
      </div>
      <div className="statistic__grid">
        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">дуэлей:</div>
            <div className="statistic__grid-item-info-value">1234</div>
          </div>
          <img src={icon1} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">% побед:</div>
            <div className="statistic__grid-item-info-value">87%</div>
          </div>
          <img src={icon2} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">выиграно:</div>
            <div className="statistic__grid-item-info-value">12345</div>
          </div>
          <img src={icon3} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">проиграно:</div>
            <div className="statistic__grid-item-info-value">12345</div>
          </div>
          <img src={icon4} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* DYNAMIC STATS */}
        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              выиграно {currencyStatEnum[activeCurrency]?.title}:
            </div>
            <div className="statistic__grid-item-info-value">12345</div>
          </div>
          <img
            src={currencyStatEnum[activeCurrency]?.plusIcon}
            alt="icon"
            className="statistic__grid-item-img"
          />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              проиграно {currencyStatEnum[activeCurrency]?.title}:
            </div>
            <div className="statistic__grid-item-info-value">12345</div>
          </div>
          <img
            src={currencyStatEnum[activeCurrency]?.minusIcon}
            alt="icon"
            className="statistic__grid-item-img"
          />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              итоговый результат:
            </div>
            <div className="statistic__grid-item-info-value">12345</div>
          </div>
          <img
            src={currencyStatEnum[activeCurrency]?.totalIcon}
            alt="icon"
            className="statistic__grid-item-img"
          />
        </div>
      </div>
    </div>
  );
}
