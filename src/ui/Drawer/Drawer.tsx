/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useDrawer } from "../../context/DrawerContext";
import { CuttedButton } from "../CuttedButton/CuttedButton";
import closeIcon from "./img/closeIcon.svg";
import resolvedIcon from "./img/resolved.svg";
import rejectedIcon from "./img/rejected.svg";

import telegramIcon from "./img/menu/tg.svg";
import xIcon from "./img/menu/x.svg";
import youtubeIcon from "./img/menu/youtube.svg";
import walletIcon from "./img/menu/wallet.svg";
import creditIcon from "./img/upgrade/credits.svg";
import upgradeArrowsSvg from "./img/upgrade/arrows.svg";
import "./styles//drawer.css";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { CryptoButtons } from "../CryptoButtons/CryptoButtons";
import { useState } from "react";

type DrawerProps = {
  isOpen: boolean;
  drawerText?: string;
};

export function Drawer({ isOpen, drawerText }: DrawerProps) {
  const { closeDrawer, drawerType, drawerPosition } = useDrawer();

  const drawerContentType = {
    resolved: <Resolved drawerText={drawerText} />,
    rejected: <Rejected drawerText={drawerText} />,
    menu: <Menu />,
    connectWallet: <ConnectWallet />,
    repair: <Repair />,
    upgrade: <Upgrade />,
  };

  return (
    <div
      className={`drawerBg ${
        !isOpen ? "drawerBg--Hidden" : ""
      }  ${drawerPosition}`}
    >
      <div
        className={`drawer ${!isOpen ? "drawer--Hidden" : ""} ${drawerType}`}
      >
        <img
          src={closeIcon}
          alt="closeIcon"
          className="drawer__closeIcon"
          onClick={closeDrawer}
        />
        {drawerContentType[drawerType as keyof typeof drawerContentType]}
      </div>
    </div>
  );
}

function ConnectWallet() {
  const { closeDrawer } = useDrawer();
  const [tonConnectUI] = useTonConnectUI();
  async function connectWallet() {
    // Синхронно закрываем текущий drawer
    closeDrawer!();

    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    await tonConnectUI.openModal();
    // await openDrawer("resolved");
  }

  return (
    <div className="connectWallet">
      <div className="connectWallet__text">Подключите свой кошелек</div>

      <CuttedButton
        className="connectWallet__mainBtn"
        text={"Подключить"}
        callback={connectWallet}
      />

      <button className="connectWallet__laterBtn" onClick={closeDrawer}>
        Позже
      </button>
    </div>
  );
}

function Resolved({ drawerText }: { drawerText?: string }) {
  return (
    <div className="responseStatus">
      <img src={resolvedIcon} alt="resolved" className="responseStatus__icon" />

      <div className="responseStatus__title">Успешно!</div>

      <div className="responseStatus__text">{drawerText}</div>
    </div>
  );
}

function Rejected({ drawerText }: { drawerText?: string }) {
  return (
    <div className="responseStatus">
      <img src={rejectedIcon} alt="resolved" className="responseStatus__icon" />

      <div className="responseStatus__title">Ошибка!</div>

      <div className="responseStatus__text">{drawerText}</div>
    </div>
  );
}

function Menu() {
  const { closeDrawer, openDrawer } = useDrawer();

  async function openWalletDrawer() {
    // Синхронно закрываем текущий drawer
    closeDrawer!();

    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    openDrawer!("connectWallet");
  }

  return (
    <div className="menu">
      <div className="menu__text">Быстрое меню</div>

      <div className="menu__list">
        <a href="#" className="menu__list-item">
          <img src={telegramIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">телеграм канал</div>
        </a>

        <a href="#" className="menu__list-item">
          <img src={xIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">x.com (twitter)</div>
        </a>

        <a href="#" className="menu__list-item">
          <img src={youtubeIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">youtube канал</div>
        </a>

        <div className="menu__list-item" onClick={openWalletDrawer}>
          <img src={walletIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">подключить кошелек</div>
        </div>
      </div>
    </div>
  );
}

function Repair() {
  const [activeCurrency, setActiveCurrency] = useState("credits");

  return (
    <div className="repair">
      <div className="repair__text">Починить на 100%</div>

      <div className="repair__block">
        <div className="repair__block-row">
          <div className="repair__block-row-key">цена:</div>
          <div className="repair__block-row-value">1234.5678</div>
        </div>

        <CryptoButtons
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
          activeOptions={["credits", "woopy"]}
        />
      </div>

      <CuttedButton className="repair__mainBtn" text={"Подтвердить"} />
    </div>
  );
}

function Upgrade() {
  return (
    <div className="upgradeBody">
      <div className="upgrade__text">Улучшение</div>

      <div className="upgrade__block">
        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">Урон:</div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">123</div>
              <img
                src={upgradeArrowsSvg}
                alt="arrows"
                className="upgrade__block-item-main-value-arrows"
              />
              <div className="upgrade__block-item-main-value-max">170</div>
            </div>
          </div>
          <div className="upgrade__block-item-cuttedButtonWrapper">
            <CuttedButton iconSrc={creditIcon} text={"125K"} />
          </div>
        </div>

        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">Заряд:</div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">1234</div>
              <img
                src={upgradeArrowsSvg}
                alt="arrows"
                className="upgrade__block-item-main-value-arrows"
              />
              <div className="upgrade__block-item-main-value-max">1500</div>
            </div>
          </div>
          <div className="upgrade__block-item-cuttedButtonWrapper">
            <CuttedButton
              className="halfTransparent"
              iconSrc={creditIcon}
              text={"125K"}
            />
          </div>
        </div>

        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">
              скр. восполнения заряда::
            </div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">
                200\мин
              </div>
              <img
                src={upgradeArrowsSvg}
                alt="arrows"
                className="upgrade__block-item-main-value-arrows"
              />
              <div className="upgrade__block-item-main-value-max">500\мин</div>
            </div>
          </div>
          <div className="upgrade__block-item-cuttedButtonWrapper">
            <CuttedButton iconSrc={creditIcon} text={"125K"} />
          </div>
        </div>
      </div>
    </div>
  );
}
