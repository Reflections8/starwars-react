/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MainLinkBgIcon } from "../../../icons/MainLinkBg";
import "../styles/mainLinks.css";
import "../styles/mainLinksAnimation.css";
import iconBgLeft from "../img/mainLink-iconBg-left.png";
import iconBgRight from "../img/mainLink-iconBg-right.png";

import walletIcon from "../img/mainLinkIcons/wallet.svg";
import helmetIcon from "../img/mainLinkIcons/helmet.svg";
import chartIcon from "../img/mainLinkIcons/chart.svg";
import tasksIcon from "../img/mainLinkIcons/tasks.svg";
import teamIcon from "../img/mainLinkIcons/team.svg";
import cupIcon from "../img/mainLinkIcons/cup.svg";
import { useDrawer } from "../../../context/DrawerContext";
import { useModal } from "../../../context/ModalContext";

export function MainLinks() {
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();

  return (
    <div className="mainLinks">
      <div className="mainLinks__col">
        <div
          className="mainLinks__col-item mainLinks__col-item--slideInLeft"
          onClick={() => {
            // @ts-ignore
            openDrawer("connectWallet");
          }}
        >
          <MainLinkBgIcon color="red" />
          <img
            src={iconBgLeft}
            alt="iconBg"
            className="mainLinks__col-item-iconBg mainLinks__col-item-iconBg--Left"
          />
          <img
            src={walletIcon}
            alt="wallet"
            className="mainLinks__col-item-icon mainLinks__col-item-icon--Left"
          />
          <div className="mainLinks__col-item-text mainLinks__col-item-text--Left">
            Кошелек
          </div>
        </div>

        <div className="mainLinks__col-item mainLinks__col-item--slideInLeft2">
          <MainLinkBgIcon color="green" />
          <img
            src={iconBgLeft}
            alt="iconBg"
            className="mainLinks__col-item-iconBg mainLinks__col-item-iconBg--Left"
          />
          <img
            src={helmetIcon}
            alt="wallet"
            className="mainLinks__col-item-icon mainLinks__col-item-icon--Left"
          />
          <div className="mainLinks__col-item-text mainLinks__col-item-text--Left">
            Игрок
          </div>
        </div>

        <div className="mainLinks__col-item mainLinks__col-item--slideInLeft3">
          <MainLinkBgIcon color="purple" />
          <img
            src={iconBgLeft}
            alt="iconBg"
            className="mainLinks__col-item-iconBg mainLinks__col-item-iconBg--Left"
          />
          <img
            src={chartIcon}
            alt="wallet"
            className="mainLinks__col-item-icon mainLinks__col-item-icon--Left"
          />
          <div className="mainLinks__col-item-text mainLinks__col-item-text--Left">
            Метрика
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="mainLinks__col mainLinks__col--Right">
        <div
          className="mainLinks__col-item mainLinks__col-item--slideInRight"
          onClick={() => {
            //@ts-ignore
            openModal("tasks");
          }}
        >
          <MainLinkBgIcon color="yellow" />
          <img
            src={iconBgRight}
            alt="iconBg"
            className="mainLinks__col-item-iconBg mainLinks__col-item-iconBg--Right"
          />
          <img
            src={tasksIcon}
            alt="wallet"
            className="mainLinks__col-item-icon mainLinks__col-item-icon--Right"
          />
          <div className="mainLinks__col-item-text mainLinks__col-item-text--Right">
            Задания
          </div>
        </div>

        <div className="mainLinks__col-item mainLinks__col-item--slideInRight2">
          <MainLinkBgIcon color="blue" />
          <img
            src={iconBgRight}
            alt="iconBg"
            className="mainLinks__col-item-iconBg mainLinks__col-item-iconBg--Right"
          />
          <img
            src={teamIcon}
            alt="wallet"
            className="mainLinks__col-item-icon mainLinks__col-item-icon--Right"
          />
          <div className="mainLinks__col-item-text mainLinks__col-item-text--Right">
            Партнеры
          </div>
        </div>

        <div
          className="mainLinks__col-item mainLinks__col-item--slideInRight3"
          onClick={() => {
            //@ts-ignore
            openModal("tournament");
          }}
        >
          <MainLinkBgIcon color="pink" />
          <img
            src={iconBgRight}
            alt="iconBg"
            className="mainLinks__col-item-iconBg mainLinks__col-item-iconBg--Right"
          />
          <img
            src={cupIcon}
            alt="wallet"
            className="mainLinks__col-item-icon mainLinks__col-item-icon--Right"
          />
          <div className="mainLinks__col-item-text mainLinks__col-item-text--Right">
            Турнир
          </div>
        </div>
      </div>
    </div>
  );
}
