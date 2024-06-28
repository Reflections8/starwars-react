import { useState } from "react";
import { CryptoButtons } from "../../../ui/CryptoButtons/CryptoButtons";
import "./styles/metrics.css";
import icon1 from "./img/1.svg";
import icon2 from "./img/2.svg";
import icon3 from "./img/3.svg";
import icon4 from "./img/4.svg";
import icon5 from "./img/5.svg";

export function Metrics() {
  const [activeCurrency, setActiveCurrency] = useState("credits");

  const metrics = {
    credits: {
      deposit: "1234.56 CREDITS",
      maxProfit: "12.34%",
      earned: "1234.56 CREDITS",
      win: "1234.56 CREDITS",
      left: "123 CREDITS",
    },
    woopy: {
      deposit: "1234.56 WOOPY",
      maxProfit: "12.34%",
      earned: "1234.56 WOOPY",
      win: "1234.56 WOOPY",
      left: "123 WOOPY",
    },
    ton: {
      deposit: "1234.56 TON",
      maxProfit: "12.34%",
      earned: "1234.56 TON",
      win: "1234.56 TON",
      left: "123 TON",
    },
  };

  return (
    <div className="metrics">
      <CryptoButtons
        className="metrics__tabs"
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />

      <div className="metrics__list">
        <div className="metrics__list-item">
          <div className="metrics__list-item-key">
            <img
              src={icon1}
              alt="icon"
              className="metrics__list-item-key-icon"
            />
            <div className="metrics__list-item-key-name">Депозитов:</div>
          </div>
          <div className="metrics__list-item-value">
            {metrics[activeCurrency as keyof typeof metrics].deposit}
          </div>
        </div>

        <div className="metrics__list-item">
          <div className="metrics__list-item-key">
            <img
              src={icon2}
              alt="icon"
              className="metrics__list-item-key-icon"
            />
            <div className="metrics__list-item-key-name">Макс. профит:</div>
          </div>
          <div className="metrics__list-item-value">
            {metrics[activeCurrency as keyof typeof metrics].maxProfit}
          </div>
        </div>

        <div className="metrics__list-item">
          <div className="metrics__list-item-key">
            <img
              src={icon3}
              alt="icon"
              className="metrics__list-item-key-icon"
            />
            <div className="metrics__list-item-key-name">Заработано:</div>
          </div>
          <div className="metrics__list-item-value">
            {metrics[activeCurrency as keyof typeof metrics].earned}
          </div>
        </div>

        <div className="metrics__list-item">
          <div className="metrics__list-item-key">
            <img
              src={icon4}
              alt="icon"
              className="metrics__list-item-key-icon"
            />
            <div className="metrics__list-item-key-name">Выиграно:</div>
          </div>
          <div className="metrics__list-item-value">
            {metrics[activeCurrency as keyof typeof metrics].win}
          </div>
        </div>

        <div className="metrics__list-item">
          <div className="metrics__list-item-key">
            <img
              src={icon5}
              alt="icon"
              className="metrics__list-item-key-icon"
            />
            <div className="metrics__list-item-key-name">Ост. доход:</div>
          </div>
          <div className="metrics__list-item-value">
            {metrics[activeCurrency as keyof typeof metrics].left}
          </div>
        </div>
      </div>
    </div>
  );
}
