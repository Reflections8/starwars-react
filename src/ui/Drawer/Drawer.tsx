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
import { useState } from "react";
import { CharactersData, Prices, useUserData } from "../../UserDataService.tsx";
import { formatWalletString } from "../../utils/index.ts";
import { CryptoButtons } from "../CryptoButtons/CryptoButtons.tsx";
import telegramIcon from "./img/menu/tg.svg";
import walletIcon from "./img/menu/wallet.svg";
import xIcon from "./img/menu/x.svg";
import youtubeIcon from "./img/menu/youtube.svg";
import upgradeArrowsSvg from "./img/upgrade/arrows.svg";
import creditIcon from "./img/upgrade/credits.svg";
import "./styles//drawer.css";
import { PROJECT_CONTRACT_ADDRESS } from "../../main.tsx";
import { useBattleships } from "../../context/BattleshipsContext.tsx";

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
            <div className="menu__list-item-text">подключить кошелек</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Upgrade() {
  const { prices, activeBlaster, sendSocketMessage, credits, jwt } =
    useUserData();

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

  const handleUpgradeClick = (value: number) => {
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

    if (jwt != null && jwt !== "")
      sendSocketMessage(
        "upgradeBlaster:" +
          JSON.stringify({
            jwt_token: jwt,
            item_level: activeBlaster.level,
            config_id: value,
          })
      );
  };

  return (
    <div className="upgradeBody">
      <div className="upgrade__text">Улучшение</div>

      <div className="upgrade__block">
        <div className="upgrade__block-item">
          <div className="upgrade__block-item-main">
            <div className="upgrade__block-item-main-title">Урон:</div>
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
            <div className="upgrade__block-item-main-title">Заряд:</div>
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
              скр. восполнения заряда::
            </div>
            <div className="upgrade__block-item-main-value">
              <div className="upgrade__block-item-main-value-current">
                {activeBlaster
                  ? getChargePercentByLevel(activeBlaster.charge_level)
                  : 0}
                %\мин
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
                    %\мин
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
  const [activeCurrency, setActiveCurrency] = useState("credits");
  const { prices, activeBlaster, sendSocketMessage, credits, jwt } =
    useUserData();
  const { openDrawer } = useDrawer();
  const handleRepairClick = () => {
    if (!activeBlaster || activeBlaster.level == 1) return;

    if (credits < getBlasterRepairPrice(activeBlaster.level)) {
      openDrawer!(
        "rejected",
        "bottom",
        "Недостаточно кредитов для починки бластера"
      );
      return;
    }

    if (jwt != null && jwt !== "")
      sendSocketMessage(
        "repairBlaster:" +
          JSON.stringify({ jwt_token: jwt, item_level: activeBlaster.level })
      );
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
      <div className="repair__text">Починить на 100%</div>

      <div className="repair__block">
        <div className="repair__block-row">
          <div className="repair__block-row-key">цена:</div>
          <div className="repair__block-row-value">
            {activeBlaster ? getBlasterRepairPrice(activeBlaster.level) : null}
          </div>
        </div>

        <CryptoButtons
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
          activeOptions={["credits", "woopy"]}
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
        text={"Подтвердить"}
      />
    </div>
  );
}

function Heal() {
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
      <div className="heal__text">Исцелить на 100%</div>

      <div className="heal__block">
        <div className="heal__block-row">
          <div className="heal__block-row-key">цена:</div>
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
        text={"Подтвердить"}
      />
    </div>
  );
}

function InviteFriend() {
  const [link] = useState(
    "https://wikipedia.org/wiki/%Dahsjdkahsdjkahsdjkahsdklahsdjklasdasd"
  );
  return (
    <div className="inviteFriend">
      <div className="inviteFriend__text">
        Пригластите друга вступить в бой против Тьмы
      </div>

      <div className="inviteFriend-inputBlock-inputWrapper">
        <input
          type="decimal"
          value={link}
          disabled={true}
          className={`inviteFriend-inputBlock-input`}
        />
      </div>

      <CuttedButton
        text="скопировать"
        size="small"
        callback={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(link);
        }}
      />
    </div>
  );
}

function GiveUp() {
  const { setGameState } = useBattleships();
  const { closeDrawer } = useDrawer();
  return (
    <div className="giveUp">
      <div className="giveUp__text">Вы точно хотите сдаться?</div>

      <CuttedButton
        text="Подтвердить"
        size="small"
        callback={(e) => {
          e.stopPropagation();
          closeDrawer!();
          // @ts-ignore
          setGameState((prevState) => ({
            ...prevState,
            status: "LOST",
          }));
        }}
      />
    </div>
  );
}
