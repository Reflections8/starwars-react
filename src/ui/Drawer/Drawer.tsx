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
import "./styles//drawer.css";
import { useTonConnectUI } from "@tonconnect/ui-react";

type DrawerProps = {
  isOpen: boolean;
};

export function Drawer({ isOpen }: DrawerProps) {
  const { closeDrawer, drawerType, drawerPosition } = useDrawer();

  const drawerContentType = {
    menu: <Menu />,
    connectWallet: <ConnectWallet />,
    resolved: <Resolved />,
    rejected: <Rejected />,
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
  const { closeDrawer, openDrawer } = useDrawer();
  const [tonConnectUI] = useTonConnectUI();
  async function connectWallet() {
    // @ts-ignore
    // Синхронно закрываем текущий drawer
    closeDrawer();

    // @ts-ignore
    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    //
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

function Resolved() {
  return (
    <div className="responseStatus">
      <img src={resolvedIcon} alt="resolved" className="responseStatus__icon" />

      <div className="responseStatus__title">Успешно!</div>

      <div className="responseStatus__text">
        у вас недостаточно средств на вашем балансе
      </div>
    </div>
  );
}

function Rejected() {
  return (
    <div className="responseStatus">
      <img src={rejectedIcon} alt="resolved" className="responseStatus__icon" />

      <div className="responseStatus__title">Ошибка!</div>

      <div className="responseStatus__text">
        у вас недостаточно средств на вашем балансе
      </div>
    </div>
  );
}

function Menu() {
  const { closeDrawer, openDrawer } = useDrawer();

  async function openWalletDrawer() {
    // @ts-ignore
    // Синхронно закрываем текущий drawer
    closeDrawer();

    // @ts-ignore
    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    await openDrawer("connectWallet");
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
