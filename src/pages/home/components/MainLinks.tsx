/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MainLinkBgIcon } from "../../../icons/MainLinkBg";
import iconBgLeft from "../img/mainLink-iconBg-left.png";
import iconBgRight from "../img/mainLink-iconBg-right.png";
import "../styles/mainLinks.css";
import "../styles/mainLinksAnimation.css";

import { useModal } from "../../../context/ModalContext";
import chartIcon from "../img/mainLinkIcons/chart.svg";
import cupIcon from "../img/mainLinkIcons/cup.svg";
import helmetIcon from "../img/mainLinkIcons/helmet.svg";
import tasksIcon from "../img/mainLinkIcons/tasks.svg";
import teamIcon from "../img/mainLinkIcons/team.svg";
import walletIcon from "../img/mainLinkIcons/wallet.svg";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useDrawer } from "../../../context/DrawerContext.tsx";
import { useTranslation } from "react-i18next";
import mainLinkHighlighter from "../video/mainLink.svg";

export function MainLinks() {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { closeDrawer, openDrawer } = useDrawer();
  const [tonConnectUI] = useTonConnectUI();

  async function openWalletDrawer() {
    // Синхронно закрываем текущий drawer
    closeDrawer!();

    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    openDrawer!("connectWallet");
  }

  return (
    <div className="mainLinks">
      <div className="mainLinks__col">
        <div
          className="mainLinks__col-item mainLinks__col-item--slideInLeft"
          onClick={() => {
            if (!tonConnectUI.connected) {
              openWalletDrawer();
              return;
            }
            // @ts-ignore
            openModal("wallet");
          }}
        >
          <img
            src={mainLinkHighlighter}
            alt="highlighter"
            className={`highlighter walletBinks`}
          />
          <MainLinkBgIcon
            color="red"
            className="highlighterParent walletBinks"
          />
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
            {t("homePage.wallet")}
          </div>
        </div>

        <div
          className="mainLinks__col-item mainLinks__col-item--slideInLeft2"
          onClick={() => {
            if (!tonConnectUI.connected) {
              openWalletDrawer();
              return;
            }

            openModal!("player");
          }}
        >
          <img
            src={mainLinkHighlighter}
            alt="highlighter"
            className={`highlighter playerBinks`}
          />
          <MainLinkBgIcon
            color="green"
            className={"highlighterParent playerBinks"}
          />
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
            {t("homePage.player")}
          </div>
        </div>

        <div
          className="mainLinks__col-item mainLinks__col-item--slideInLeft3"
          onClick={() => {
            if (!tonConnectUI.connected) {
              openWalletDrawer();
              return;
            }
            // @ts-ignore
            openModal("metrics");
          }}
        >
          <img
            src={mainLinkHighlighter}
            alt="highlighter"
            className={`highlighter metricsBinks`}
          />
          <MainLinkBgIcon
            color="purple"
            className="highlighterParent metricsBinks"
          />
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
            {t("homePage.metrics")}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="mainLinks__col mainLinks__col--Right">
        <div
          className="mainLinks__col-item mainLinks__col-item--slideInRight"
          onClick={() => {
            if (!tonConnectUI.connected) {
              openWalletDrawer();
              return;
            }
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
            {t("homePage.quests")}
          </div>
        </div>

        <div
          className="mainLinks__col-item mainLinks__col-item--slideInRight2"
          onClick={() => {
            if (!tonConnectUI.connected) {
              openWalletDrawer();
              return;
            }
            //@ts-ignore
            openModal("partners");
          }}
        >
          <img
            src={mainLinkHighlighter}
            alt="highlighter"
            className={`highlighter clansBinks`}
          />
          <MainLinkBgIcon
            color="blue"
            className="highlighterParent clansBinks"
          />
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
            {t("homePage.partners")}
          </div>
        </div>

        <div
          className="mainLinks__col-item mainLinks__col-item--slideInRight3 "
          onClick={() => {
            if (!tonConnectUI.connected) {
              openWalletDrawer();
              return;
            }
            //@ts-ignore
            openModal("tournament");
          }}
        >
          <img
            src={mainLinkHighlighter}
            alt="highlighter"
            className={`highlighter tournaments`}
          />
          <MainLinkBgIcon
            color="pink"
            className="highlighterParent tournaments"
          />
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
            {t("homePage.tournament")}
          </div>
        </div>
      </div>
    </div>
  );
}
