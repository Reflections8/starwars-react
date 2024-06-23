/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useDrawer } from "../../context/DrawerContext";
import { CuttedButton } from "../CuttedButton/CuttedButton";
import closeIcon from "./img/closeIcon.svg";
import resolvedIcon from "./img/resolved.svg";
import rejectedIcon from "./img/rejected.svg";
import "./styles//drawer.css";

type DrawerProps = {
  isOpen: boolean;
};

export function Drawer({ isOpen }: DrawerProps) {
  const { closeDrawer, drawerType } = useDrawer();

  const drawerContentType = {
    connectWallet: <ConnectWallet />,
    resolved: <Resolved />,
    rejected: <Rejected />,
  };

  return (
    <div className={`drawerBg ${!isOpen ? "drawerBg--Hidden" : ""}`}>
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

  async function connectWallet() {
    // @ts-ignore
    // Синхронно закрываем текущий drawer
    closeDrawer();

    // @ts-ignore
    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    await openDrawer("rejected");
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
