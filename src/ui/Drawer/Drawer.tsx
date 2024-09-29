/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useDrawer } from "../../context/DrawerContext";
import { CuttedButton } from "../CuttedButton/CuttedButton";
import closeIcon from "./img/closeIcon.svg";
import rejectedIcon from "./img/rejected.svg";
import resolvedIcon from "./img/resolved.svg";

import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClearedTimer } from "../../components/Modals/SeaBattle/components/ClearedTimer/ClearedTimer.tsx";
import { BetTypeEnum } from "../../components/Modals/SeaBattle/types/enum.ts";
import {
  gameStates,
  useBattleships,
} from "../../context/BattleshipsContext.tsx";
import { PROJECT_CONTRACT_ADDRESS, SERVER_URL } from "../../main.tsx";
import { CharactersData, Prices, useUserData } from "../../UserDataService.tsx";
import { formatWalletString } from "../../utils/index.ts";
import { CryptoButtons } from "../CryptoButtons/CryptoButtons.tsx";
import telegramIcon from "./img/menu/tg.svg";
import walletIcon from "./img/menu/wallet.svg";
import xIcon from "./img/menu/x.svg";
import youtubeIcon from "./img/menu/youtube.svg";
import opponentFoundIcon from "./img/opponent-icon.svg";
import upgradeArrowsSvg from "./img/upgrade/arrows.svg";
import creditIcon from "./img/upgrade/credits.svg";
import "./styles//drawer.css";

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
    heal: <Heal />,
    inviteFriend: <InviteFriend />,
    giveUp: <GiveUp />,
    opponentFound: <OpponentFound />,
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
        {drawerType === "opponentFound" ? null : (
          <img
            src={closeIcon}
            alt="closeIcon"
            className="drawer__closeIcon"
            onClick={closeDrawer}
          />
        )}

        {drawerContentType[drawerType as keyof typeof drawerContentType]}
      </div>
    </div>
  );
}

function ConnectWallet() {
  const { t } = useTranslation();
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
      <div className="connectWallet__text">
        {t("connectWalletDrawer.title")}
      </div>

      <CuttedButton
        className="connectWallet__mainBtn"
        text={t("connectWalletDrawer.connect")}
        callback={connectWallet}
      />

      <button className="connectWallet__laterBtn" onClick={closeDrawer}>
        {t("connectWalletDrawer.later")}
      </button>
    </div>
  );
}

function Resolved({ drawerText }: { drawerText?: string }) {
  const { t } = useTranslation();
  return (
    <div className="responseStatus">
      <img src={resolvedIcon} alt="resolved" className="responseStatus__icon" />

      <div className="responseStatus__title">{t("resolvedDrawer.title")}!</div>

      <div className="responseStatus__text">{drawerText}</div>
    </div>
  );
}

function Rejected({ drawerText }: { drawerText?: string }) {
  const { t } = useTranslation();
  return (
    <div className="responseStatus">
      <img src={rejectedIcon} alt="resolved" className="responseStatus__icon" />

      <div className="responseStatus__title">{t("rejectedDrawer.title")}!</div>

      <div className="responseStatus__text">{drawerText}</div>
    </div>
  );
}

function Menu() {
  const { t } = useTranslation();
  const wallet = useTonWallet();
  const { closeDrawer, openDrawer } = useDrawer();

  async function openWalletDrawer() {
    // Синхронно закрываем текущий drawer
    closeDrawer!();

    // Делаем что-то асинхронное, в зависимости от ответа открываем resolved/rejected
    openDrawer!("connectWallet");
  }

  return (
    <div className="menu">
      <div className="menu__text">{t("quickMenu.title")}</div>

      <div className="menu__list">
        <a href="#" className="menu__list-item">
          <img src={telegramIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">{t("quickMenu.telegram")}</div>
        </a>

        <a href="#" className="menu__list-item">
          <img src={xIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">{t("quickMenu.xTwitter")}</div>
        </a>

        <a href="#" className="menu__list-item">
          <img src={youtubeIcon} alt="icon" className="menu__list-item-icon" />
          <div className="menu__list-item-text">{t("quickMenu.youtube")}</div>
        </a>

        {wallet ? (
          <div className="menu__list-item menu__list-item--Transparent">
            <img src={walletIcon} alt="icon" className="menu__list-item-icon" />
            <div className="menu__list-item-text">
              {formatWalletString(wallet.account.address)}
            </div>
          </div>
        ) : (
          <div className="menu__list-item" onClick={openWalletDrawer}>
            <img src={walletIcon} alt="icon" className="menu__list-item-icon" />
            <div className="menu__list-item-text">
              {t("quickMenu.connectWallet")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Upgrade() {
  const { t } = useTranslation();
  const { prices, activeBlaster, updateUserInfo, credits, jwt } = useUserData();

  const { openDrawer } = useDrawer();

  const damages = [
    [1, 2, 3, 4], // Blaster 1
    [3, 4, 5, 6], // Blaster 2
    [8, 10, 12, 15], // Blaster 3
  ];

  const maxCharges = [
    [500, 600, 700, 800], // Blaster 1
    [1000, 1200, 1400, 1600], // Blaster 2
    [2000, 2500, 3000, 3500], // Blaster 3
  ];

  const chargePercents = [
    [1, 1.1, 1.2, 1.3], // Blaster 1
    [1.5, 1.7, 1.8, 2], // Blaster 2
    [2.2, 2.4, 2.6, 2.8], // Blaster 3
  ];

  function getDamageByLevel(level: number) {
    if (!activeBlaster) return 0;
    return damages[activeBlaster?.level - 1][level];
  }

  function getMaxChargeByLevel(level: number) {
    if (!activeBlaster) return 0;
    return maxCharges[activeBlaster?.level - 1][level];
  }

  function getChargePercentByLevel(level: number) {
    if (!activeBlaster) return 0;
    return chargePercents[activeBlaster?.level - 1][level];
  }

  function getPriceByLevel(level: number) {
    if (!activeBlaster) return 0;

    const key = `blaster_${activeBlaster?.level}_${level}` as keyof Prices;
    return prices[key];
  }

  const handleUpgradeClick = async (value: number) => {
    if (!activeBlaster) return;
    if (value != 0 && value != 1 && value != 2) return;
    let nextOptionLevel;
    if (value == 0) nextOptionLevel = activeBlaster.damage_level + 1;
    else if (value == 1) nextOptionLevel = activeBlaster.max_charge_level + 1;
    else nextOptionLevel = activeBlaster.charge_level + 1;

    if (nextOptionLevel >= 4) return;

    if (credits < getPriceByLevel(nextOptionLevel)) {
      openDrawer!(
        "rejected",
        "bottom",
        "Недостаточно кредитов для улучшения бластера"
      );
      return;
    }

    if (jwt != null && jwt !== "") {
      try {
        const reqBody = {
          item_level: activeBlaster.level,
          config_id: value,
        };
        const response = await fetch(SERVER_URL + "/main/upgradeBlaster", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(reqBody),
        });

        if (!response.ok) {
          openDrawer!(
            "rejected",
            "bottom",
            "Произошла ошибка во время выполнения операции"
          );
        } else {
          openDrawer!(
            "resolved",
            "bottom",
            "Улучшение бластера выполнено успешно."
          );
          await updateUserInfo(jwt);
        }
      } catch (e) {
        openDrawer!(
          "rejected",
          "bottom",
          "Произошла ошибка во время выполнения операции"
        );
      }
    }
  };

  return (
    <div className="upgradeBody">
      <div className="upgrade__text">{t("upgradeDrawer.upgrade")}</div>

      <div className="upgrade__block">
        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">
              {t("upgradeDrawer.damage")}:
            </div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">
                {activeBlaster
                  ? getDamageByLevel(activeBlaster.damage_level)
                  : 0}
              </div>
              {activeBlaster && activeBlaster.damage_level < 3 ? (
                <>
                  <img
                    src={upgradeArrowsSvg}
                    alt="arrows"
                    className="upgrade__block-item-main-value-arrows"
                  />
                  <div className="upgrade__block-item-main-value-max">
                    {getDamageByLevel(activeBlaster.damage_level + 1)}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="upgrade__block-item-cuttedButtonWrapper">
            <CuttedButton
              iconSrc={creditIcon}
              callback={() => handleUpgradeClick(0)}
              className={
                activeBlaster && activeBlaster.damage_level < 3
                  ? ""
                  : "halfTransparent"
              }
              text={
                activeBlaster && activeBlaster.damage_level < 3
                  ? (
                      getPriceByLevel(activeBlaster.damage_level + 1) / 1000
                    ).toString() + "K"
                  : "MAX"
              }
            />
          </div>
        </div>

        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">
              {t("upgradeDrawer.charge")}:
            </div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">
                {activeBlaster
                  ? getMaxChargeByLevel(activeBlaster.max_charge_level)
                  : 0}
              </div>
              {activeBlaster && activeBlaster.max_charge_level < 3 ? (
                <>
                  <img
                    src={upgradeArrowsSvg}
                    alt="arrows"
                    className="upgrade__block-item-main-value-arrows"
                  />
                  <div className="upgrade__block-item-main-value-max">
                    {activeBlaster
                      ? getMaxChargeByLevel(activeBlaster.max_charge_level + 1)
                      : 0}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="upgrade__block-item-cuttedButtonWrapper">
            <CuttedButton
              callback={() => handleUpgradeClick(1)}
              className={
                activeBlaster && activeBlaster.max_charge_level < 3
                  ? ""
                  : "halfTransparent"
              }
              iconSrc={creditIcon}
              text={
                activeBlaster && activeBlaster.max_charge_level < 3
                  ? (
                      getPriceByLevel(activeBlaster.max_charge_level + 1) / 1000
                    ).toString() + "K"
                  : "MAX"
              }
            />
          </div>
        </div>

        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">
              {t("upgradeDrawer.chargeReplenishementSpeed")}:
            </div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">
                {activeBlaster
                  ? getChargePercentByLevel(activeBlaster.charge_level)
                  : 0}
                %\{t("global.minute")}
              </div>
              {activeBlaster && activeBlaster.charge_level < 3 ? (
                <>
                  <img
                    src={upgradeArrowsSvg}
                    alt="arrows"
                    className="upgrade__block-item-main-value-arrows"
                  />
                  <div className="upgrade__block-item-main-value-max">
                    {activeBlaster
                      ? getChargePercentByLevel(activeBlaster.charge_level + 1)
                      : 0}
                    %\{t("global.minute")}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="upgrade__block-item-cuttedButtonWrapper">
            <CuttedButton
              callback={() => handleUpgradeClick(2)}
              className={
                activeBlaster && activeBlaster.charge_level < 3
                  ? ""
                  : "halfTransparent"
              }
              iconSrc={creditIcon}
              text={
                activeBlaster && activeBlaster.charge_level < 3
                  ? (
                      getPriceByLevel(activeBlaster.charge_level + 1) / 1000
                    ).toString() + "K"
                  : "MAX"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Repair() {
  const { t } = useTranslation();
  const [activeCurrency, setActiveCurrency] = useState("credits");
  const { prices, activeBlaster, updateUserInfo, credits, jwt } = useUserData();
  const { openDrawer } = useDrawer();
  const handleRepairClick = async () => {
    if (!activeBlaster || activeBlaster.level == 1) return;

    if (credits < getBlasterRepairPrice(activeBlaster.level)) {
      openDrawer!(
        "rejected",
        "bottom",
        "Недостаточно кредитов для починки бластера"
      );
      return;
    }

    if (jwt != null && jwt !== "") {
      try {
        const reqBody = {
          item_level: activeBlaster.level,
        };
        const response = await fetch(SERVER_URL + "/main/repairBlaster", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(reqBody),
        });

        if (!response.ok) {
          openDrawer!(
            "rejected",
            "bottom",
            "Произошла ошибка во время выполнения операции"
          );
        } else {
          openDrawer!(
            "resolved",
            "bottom",
            "Починка бластера выполнена успешно."
          );
          await updateUserInfo(jwt);
        }
      } catch (e) {
        openDrawer!(
          "rejected",
          "bottom",
          "Произошла ошибка во время выполнения операции"
        );
      }
    }
  };

  const getBlasterRepairPrice = (level: number): number => {
    switch (level) {
      case 1:
        return 0;
      case 2:
        return prices.second_blaster_repair;
      case 3:
        return prices.third_blaster_repair;
    }
    return 0;
  };

  return (
    <div className="repair">
      <div className="repair__text">{t("repairDrawer.repair100")}</div>

      <div className="repair__block">
        <div className="repair__block-row">
          <div className="repair__block-row-key">
            {t("repairDrawer.price")}:
          </div>
          <div className="repair__block-row-value">
            {activeBlaster ? getBlasterRepairPrice(activeBlaster.level) : null}
          </div>
        </div>

        <CryptoButtons
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
          activeOptions={["credits", "akron"]}
        />
      </div>

      <CuttedButton
        callback={() => handleRepairClick()}
        className={
          activeBlaster &&
          activeBlaster.level !== 1 &&
          credits >= getBlasterRepairPrice(activeBlaster.level) &&
          getBlasterRepairPrice(activeBlaster.level) != 0
            ? "repair__mainBtn"
            : "repair__mainBtn halfTransparent"
        }
        text={t("repairDrawer.repair")}
      />
    </div>
  );
}

function Heal() {
  const { t } = useTranslation();
  const { healingCharacter, jwt } = useUserData();
  const [tonConnectUI] = useTonConnectUI();
  const { openDrawer } = useDrawer();
  const handleHealClick = async () => {
    if (!healingCharacter) return;

    if (jwt == null || jwt === "" || !tonConnectUI.connected) {
      openDrawer!("connectWallet");
    } else {
      const fillTx: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: PROJECT_CONTRACT_ADDRESS,
            amount: (
              CharactersData[healingCharacter.type - 1].price * 1000000000 +
              50000000
            ).toString(),
            payload: CharactersData[healingCharacter.type - 1].payload_heal,
          },
        ],
      };
      try {
        await tonConnectUI.sendTransaction(fillTx);
        openDrawer!(
          "resolved",
          "bottom",
          "Транзакция успешно отправлена.\n Ожидайте подтвержения"
        );
      } catch (e) {
        console.log(e);
        openDrawer!("rejected", "bottom", "Отправка транзакции была отклонена");
      }
    }
  };

  return (
    <div className="heal">
      <div className="heal__text">{t("healDrawer.heal100")}</div>

      <div className="heal__block">
        <div className="heal__block-row">
          <div className="heal__block-row-key">{t("healDrawer.price")}:</div>
          <div className="heal__block-row-value">
            {healingCharacter
              ? CharactersData[healingCharacter.type - 1].price
              : null}{" "}
            TON
          </div>
        </div>
      </div>

      <CuttedButton
        callback={() => handleHealClick()}
        className={
          healingCharacter &&
          healingCharacter.earned >= healingCharacter.earn_required
            ? "heal__mainBtn"
            : "heal__mainBtn halfTransparent"
        }
        text={t("healDrawer.heal")}
      />
    </div>
  );
}

function InviteFriend() {
  const { t } = useTranslation();
  const { refInfo } = useUserData();
  return (
    <div className="inviteFriend">
      <div className="inviteFriend__text">
        {t("inviteFriendDrawer.inviteText")}
      </div>

      <div className="inviteFriend-inputBlock-inputWrapper">
        <input
          type="decimal"
          value={refInfo?.invite_link}
          disabled={true}
          className={`inviteFriend-inputBlock-input`}
        />
      </div>

      <CuttedButton
        text={t("inviteFriendDrawer.copy")}
        size="small"
        callback={(e) => {
          e.stopPropagation();
          if (refInfo != null)
            navigator.clipboard.writeText(refInfo.invite_link);
        }}
      />
    </div>
  );
}

function GiveUp() {
  const { t } = useTranslation();
  const { roomName, sendMessage } = useBattleships();
  const { closeDrawer } = useDrawer();
  return (
    <div className="giveUp">
      <div className="giveUp__text">{t("giveUpDrawer.text")}</div>

      <CuttedButton
        text={t("giveUpDrawer.giveUp")}
        size="small"
        callback={(e) => {
          e.stopPropagation();
          sendMessage({
            type: "give_up",
            message: {
              room_name: roomName,
            },
          });
          closeDrawer!();
        }}
      />
    </div>
  );
}

function OpponentFound() {
  const { t } = useTranslation();
  const { closeDrawer, openDrawer } = useDrawer();
  const {
    approveGame,
    handleApproveGame,
    handleDeclineGame,
    setGameState,
    gameState,
    handshakeTimer,
  } = useBattleships();
  const [remainTime, setRemainTime] = useState(60 * 1000);
  const [betType] = useState(approveGame?.bet_type);
  const [betAmount] = useState(approveGame?.bet_amount);

  const [title, setTitle] = useState(
    approveGame?.is_creator
      ? t("opponentFoundDrawer.creatorTitle")
      : t("opponentFoundDrawer.playerTitle")
  );

  const resetTimer = () => {
    setRemainTime(0);
    setTimeout(() => {
      setRemainTime(60 * 1000);
    }, 10);
  };

  useEffect(() => {
    if (handshakeTimer.state === 1 || handshakeTimer.state === 2)
      setRemainTime(handshakeTimer.time * 1000);
  }, [handshakeTimer]);

  useEffect(() => {
    if (gameState === 0) resetTimer();
    if (gameState === 1) {
      if (approveGame.is_creator) {
        setTitle(t("opponentFoundDrawer.creatorTitle"));
      } else {
        setTitle(t("opponentFoundDrawer.playerTitle"));
      }
    }

    if (gameState === 2) {
      closeDrawer!();
    }

    if (gameState === 10) {
      setTitle(t("opponentFoundDrawer.waiting"));
    }
    if (gameState === 11) {
      openDrawer!(
        "rejected",
        "bottom",
        t("opponentFoundDrawer.youCanceledGame")
      );
      setGameState(gameStates.NOT_STARTED);
    }
    if (gameState === 12) {
      openDrawer!(
        "rejected",
        "bottom",
        t("opponentFoundDrawer.creatorCanceledGame")
      );
      console.log({ gameState });
    }
    if (gameState === 13) {
      openDrawer!(
        "rejected",
        "bottom",
        t("opponentFoundDrawer.opponentCanceledGame")
      );
      setGameState(gameStates.NOT_STARTED);
    }
  }, [gameState]);

  return (
    <div className="opponentFound">
      <img src={opponentFoundIcon} alt="" className="opponentFound__icon" />
      <div className="opponentFound__text">
        {title} ({approveGame?.opponent_name})
      </div>

      <div className="opponentFound__betBox">
        <div className="opponentFound__betBox-main">
          <div className="opponentFound__betBox-main-key">
            {t("opponentFoundDrawer.bid")}:
          </div>
          <div className="opponentFound__betBox-main-value">
            {betAmount} {BetTypeEnum[betType]}
          </div>
        </div>

        <div className="opponentFound__betBox-timerWrapper">
          {/* @ts-ignore */}
          <ClearedTimer
            remainTime={remainTime}
            callback={() => {
              closeDrawer!();
            }}
          />
        </div>
      </div>

      <div className="opponentFound__footer">
        <CuttedButton
          text={t("opponentFoundDrawer.dismiss")}
          className="secondary"
          size="small"
          callback={(e) => {
            handleDeclineGame();
            e.stopPropagation();
          }}
        />

        <CuttedButton
          text={t("opponentFoundDrawer.accept")}
          size="small"
          callback={(e) => {
            handleApproveGame();
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}
