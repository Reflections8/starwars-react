/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import { PillType } from "../../../ui/SlidingPills/types";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import "./styles/wallet.css";
import "./styles/fill.css";
import "./styles/withdraw.css";
import "./styles/exchange.css";
import creditIcon from "./img/credit.svg";
import woopyIcon from "./img/woopy.svg";
import tonIcon from "./img/ton.svg";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { useDrawer } from "../../../context/DrawerContext";
import exchangeBadgeBgLeft from "./img/exchange-bg-left.svg";
import exchangeBadgeBgRight from "./img/exchange-bg-right.svg";
import badgeCredit from "./img/badge-credit.svg";
import badgeWoopy from "./img/badge-woopy.svg";
import { Select } from "../../../ui/Select/Select";
import { SelectOptionType } from "../Settings/types";

const pills: PillType[] = [
  {
    label: "Пополнить",
    value: "FILL",
    component: <Fill />,
  },
  {
    label: "Обмен",
    value: "EXCHANGE",
    component: <Exchange />,
  },
  {
    label: "Вывод",
    value: "WITHDRAW",
    component: <Withdraw />,
  },
];

export function Wallet() {
  const [credits] = useState(123456);
  const [woopy] = useState(123);
  const [ton] = useState(1233);

  const [activePill, setActivePill] = useState(pills[2]);
  return (
    <div className="wallet">
      <div className="wallet__balance">
        <div className="wallet__balance-box">
          <div className="wallet__balance-box-key">
            <img
              src={creditIcon}
              alt="icon"
              className="wallet__balance-box-key-icon"
            />
            <div className="wallet__balance-box-key-title">Credit</div>
          </div>

          <div className="wallet__balance-box-value">{credits}</div>
        </div>

        <div className="wallet__balance-box">
          <div className="wallet__balance-box-key">
            <img
              src={woopyIcon}
              alt="icon"
              className="wallet__balance-box-key-icon"
            />
            <div className="wallet__balance-box-key-title">Woopy</div>
          </div>

          <div className="wallet__balance-box-value">{woopy}</div>
        </div>

        <div className="wallet__balance-box">
          <div className="wallet__balance-box-key">
            <img
              src={tonIcon}
              alt="icon"
              className="wallet__balance-box-key-icon"
            />
            <div className="wallet__balance-box-key-title">Ton</div>
          </div>

          <div className="wallet__balance-box-value">{ton}</div>
        </div>
      </div>
      <div className="wallet__pillsContainer">
        <SlidingPills
          pills={pills}
          activePill={activePill}
          setActivePill={setActivePill}
        />
      </div>

      <div className="modal__scrollContainer">{activePill.component}</div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}

export function Fill() {
  const { openDrawer } = useDrawer();

  return (
    <div className="fill">
      <div className="fill__title">пополнение баланса ton</div>

      <div className="fill__inputBlock">
        <div className="fill__inputBlock-sup">
          <label className="fill__inputBlock-sup-label">Сумма:</label>
          <div className="fill__inputBlock-sup-minValue">мин. 0.05</div>
        </div>

        <div className="fill__inputBlock-inputWrapper">
          <input type="text" className="fill__inputBlock-input" />
          <div className="fill__inputBlock-postfix">TON</div>
        </div>
      </div>

      <div className="fill__cuttedButtonWrapper">
        <CuttedButton
          text="пополнить"
          callback={() => {
            // @ts-ignore
            openDrawer("connectWallet");
          }}
        />
      </div>
    </div>
  );
}

export function Exchange() {
  return (
    <div className="exchange">
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
              src={badgeCredit}
              alt="icon"
              className="exchange__badge-item-name-icon"
            />
            <div className="exchange__badge-item-name-value">credits</div>
          </div>

          <div className="exchange__badge-item-amount">1</div>
        </div>

        <div className="exchange__badge-item-equalsSign">=</div>

        <div className="exchange__badge-item exchange__badge-item--Right">
          <div className="exchange__badge-item-amount">75</div>

          <div className="exchange__badge-item-name">
            <img
              src={badgeWoopy}
              alt="icon"
              className="exchange__badge-item-name-icon"
            />
            <div className="exchange__badge-item-name-value">woopy</div>
          </div>
        </div>
      </div>

      <div className="exchange__inputBlock">
        <div className="exchange__inputBlock-sup">
          <label className="exchange__inputBlock-sup-label">Отдаете:</label>
          <div className="exchange__inputBlock-sup-minValue">макс. 12345</div>
        </div>

        <div className="exchange__inputBlock-inputWrapper">
          <input type="text" className="exchange__inputBlock-input" />
          <div className="exchange__inputBlock-iconBox">
            <img
              src={creditIcon}
              alt="icon"
              className="exchange__inputBlock-iconBox-icon"
            />
            <div className="exchange__inputBlock-iconBox-text">Credits</div>
          </div>
        </div>
      </div>

      <div className="exchange__inputBlock">
        <div className="exchange__inputBlock-sup">
          <label className="exchange__inputBlock-sup-label">Получаете:</label>
        </div>

        <div className="exchange__inputBlock-inputWrapper">
          <input type="text" className="exchange__inputBlock-input" />
          <div className="exchange__inputBlock-iconBox">
            <img
              src={woopyIcon}
              alt="icon"
              className="exchange__inputBlock-iconBox-icon"
            />
            <div className="exchange__inputBlock-iconBox-text">Woopy</div>
          </div>
        </div>
      </div>

      <div className="exchange__cuttedButtonWrapper">
        <CuttedButton text="обменять" />
      </div>
    </div>
  );
}
export function Withdraw() {
  const currencyOptions: SelectOptionType[] = [
    {
      label: "woopy",
      value: "WOOPY",
    },
    {
      label: "ton",
      value: "TON",
    },
  ];

  const [activeCurrency, setActiveCurrency] = useState(currencyOptions[0]);
  return (
    <div className="withdraw">
      <div className="withdraw__inputBlock">
        <div className="withdraw__inputBlock-sup">
          <label className="withdraw__inputBlock-sup-label">Отдаете:</label>
          <div className="withdraw__inputBlock-sup-minValue">макс. 12345</div>
        </div>

        <div className="withdraw__inputBlock-inputWrapper">
          <input type="text" className="withdraw__inputBlock-input" />
          <Select
            activeOption={activeCurrency}
            setActiveOption={setActiveCurrency}
            options={currencyOptions}
          />
        </div>

        <div className="withdraw__cuttedButtonWrapper">
          <CuttedButton text="вывод" />
        </div>

        <div className="withdraw__bottomText">
          скорость вывода средств зависит от загруженности сети solona
        </div>
      </div>
    </div>
  );
}
