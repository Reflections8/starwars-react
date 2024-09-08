/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { PillType } from "../../../ui/SlidingPills/types";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import "./styles/wallet.css";
import "./styles/fill.css";
import "./styles/withdraw.css";
import "./styles/exchange.css";
import creditIcon from "./img/credit.svg";
import akronIcon from "./img/akron.svg";
import tonIcon from "./img/ton.svg";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import { useDrawer } from "../../../context/DrawerContext";
import exchangeBadgeBgLeft from "./img/exchange-bg-left.svg";
import exchangeBadgeBgRight from "./img/exchange-bg-right.svg";
import badgeCredit from "./img/badge-credit.svg";
import badgeAkron from "./img/badge-akron.svg";
import { Select } from "../../../ui/Select/Select";
import { SelectOptionType } from "../Settings/types";
import { useUserData } from "../../../UserDataService.tsx";
import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { PROJECT_CONTRACT_ADDRESS, SERVER_URL } from "../../../main.tsx";
import { formatWalletString } from "../../../utils/index.ts";
import walletIcon from "../../../ui/Drawer/img/menu/wallet.svg";
import { Balance } from "../../../ui/Balance/Balance.tsx";

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
  const { credits, tokens, tons } = useUserData();

  const wallet = useTonWallet();
  const [activePill, setActivePill] = useState(pills[0]);
  return (
    <>
      <div className="wallet modal__scrollContainer">
        {wallet ? (
          <div className="wallet__connectedWalletBox">
            <img
              src={walletIcon}
              alt="icon"
              className="wallet__connectedWalletBox-icon"
            />
            <div className="wallet__connectedWalletBox-text">
              {wallet.account != null
                ? formatWalletString(wallet.account.address.toString())
                : ""}
            </div>
          </div>
        ) : null}

        <Balance
          icon1={creditIcon}
          name1="Credit"
          value1={credits}
          icon2={akronIcon}
          name2="Akron"
          value2={tokens}
          icon3={tonIcon}
          name3="Ton"
          value3={tons}
        />
        <div className="wallet__pillsContainer">
          <SlidingPills
            pills={pills}
            activePill={activePill}
            setActivePill={setActivePill}
          />
        </div>

        <div>{activePill.component}</div>
      </div>
      <div className="wallet modal__scrollContainer__bottomGradient"></div>
    </>
  );
}

export function Fill() {
  const { openDrawer } = useDrawer();
  const { startCheckBalance } = useUserData();
  const [tonConnectUI] = useTonConnectUI();
  const [value, setValue] = useState("0.05");

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (regex.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleBlur = () => {
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue) && numericValue < 0.05) {
      setValue("0.05");
    }
  };

  return (
    <div className="fill">
      <div className="fill__title">пополнение баланса ton</div>

      <div className="fill__inputBlock">
        <div className="fill__inputBlock-sup">
          <label className="fill__inputBlock-sup-label">Сумма:</label>
          <div className="fill__inputBlock-sup-minValue">мин. 0.05</div>
        </div>

        <div className="fill__inputBlock-inputWrapper">
          <input
            inputMode="decimal"
            type="text"
            min="0.05"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="fill__inputBlock-input"
          />
          <div className="fill__inputBlock-postfix">TON</div>
        </div>
      </div>

      <div className="fill__cuttedButtonWrapper">
        <CuttedButton
          text="пополнить"
          callback={async () => {
            if (!tonConnectUI.connected) {
              openDrawer!("connectWallet");
              return;
            }

            const fillTx: SendTransactionRequest = {
              validUntil: Math.floor(Date.now() / 1000) + 600,
              messages: [
                {
                  address: PROJECT_CONTRACT_ADDRESS,
                  amount: (parseFloat(value) * 1000000000).toString(),
                  payload: "te6cckEBAQEACgAAEPbRsjsAAAABisLDuQ==",
                },
              ],
            };

            try {
              await tonConnectUI.sendTransaction(fillTx);
              startCheckBalance();
              openDrawer!(
                "resolved",
                "bottom",
                "Транзакция успешно отправлена.\n Ожидайте подтвержения"
              );
            } catch (e) {
              openDrawer!(
                "rejected",
                "bottom",
                "Отправка транзакции была отклонена"
              );
            }
          }}
        />
      </div>
    </div>
  );
}

export function Exchange() {
  const { credits, exchangeRate, jwt, updateUserInfo } = useUserData();
  const { openDrawer } = useDrawer();

  const [creditsText, setCredits] = useState("");
  const [tokensText, setTokens] = useState("");
  const minCredits = 1; // Минимальное количество кредитов

  const handleCreditsChange = (e: any) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setCredits(value);
      setTokens(
        value === "" ? "" : (parseInt(value, 10) * exchangeRate).toFixed(1)
      );
    }
  };

  const handleCreditsBlur = () => {
    let numericValue = parseInt(creditsText, 10);
    if (isNaN(numericValue) || numericValue < minCredits) {
      numericValue = minCredits;
    } else if (numericValue > credits) {
      numericValue = credits;
    }
    setCredits(numericValue.toString());
    setTokens((numericValue * exchangeRate).toFixed(1));
  };

  const handleTokensChange = (e: any) => {
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]{0,6}$/.test(value)) {
      setTokens(value);
      const calculatedCredits = Math.floor(parseFloat(value) / exchangeRate);
      setCredits(value === "" ? "" : calculatedCredits.toString());
    }
  };

  const handleTokensBlur = () => {
    const numericValue = parseFloat(tokensText);
    let calculatedCredits = Math.floor(numericValue / exchangeRate);
    if (isNaN(calculatedCredits) || calculatedCredits < minCredits) {
      calculatedCredits = minCredits;
    } else if (calculatedCredits > credits) {
      calculatedCredits = credits;
    }
    setTokens((calculatedCredits * exchangeRate).toFixed(1));
    setCredits(calculatedCredits.toString());
  };

  const handleExchangeClick = async () => {
    if (jwt == null) return;

    const numericCredits = parseInt(creditsText, 10);

    if (numericCredits > 1 && numericCredits <= credits) {
      try {
        const reqBody = { credits: numericCredits };
        const response = await fetch(SERVER_URL + "/main/exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(reqBody),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.code == 1) {
            openDrawer!("resolved", "bottom", "Обмен выполнен успешно");
            await updateUserInfo(jwt);
            return;
          }
        }
        openDrawer!("rejected", "bottom", "Произошла ошибка во время обмена");
      } catch (error) {
        console.log(error);
        openDrawer!("rejected", "bottom", "Произошла ошибка во время обмена");
      }
    } else {
      openDrawer!(
        "rejected",
        "bottom",
        "Неккоректное количество кредитов для обмена"
      );
    }
  };

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
          <div className="exchange__badge-item-amount">{exchangeRate}</div>

          <div className="exchange__badge-item-name">
            <img
              src={badgeAkron}
              alt="icon"
              className="exchange__badge-item-name-icon"
            />
            <div className="exchange__badge-item-name-value">akron</div>
          </div>
        </div>
      </div>

      <div className="exchange__inputBlock">
        <div className="exchange__inputBlock-sup">
          <label className="exchange__inputBlock-sup-label">Отдаете:</label>
          <div className="exchange__inputBlock-sup-minValue">
            макс. {credits}
          </div>
        </div>

        <div className="exchange__inputBlock-inputWrapper">
          <input
            type="text"
            value={creditsText}
            onChange={handleCreditsChange}
            onBlur={handleCreditsBlur}
            className="exchange__inputBlock-input"
          />
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
          <input
            type="text"
            value={tokensText}
            onChange={handleTokensChange}
            onBlur={handleTokensBlur}
            className="exchange__inputBlock-input"
          />
          <div className="exchange__inputBlock-iconBox">
            <img
              src={akronIcon}
              alt="icon"
              className="exchange__inputBlock-iconBox-icon"
            />
            <div className="exchange__inputBlock-iconBox-text">Akron</div>
          </div>
        </div>
      </div>

      <div className="exchange__cuttedButtonWrapper">
        <CuttedButton text="обменять" callback={handleExchangeClick} />
      </div>
    </div>
  );
}
export function Withdraw() {
  const currencyOptions: SelectOptionType[] = [
    {
      label: "akron",
      value: "AKRON",
    },
    {
      label: "ton",
      value: "TON",
    },
  ];

  const [activeCurrency, setActiveCurrency] = useState(currencyOptions[0]);
  const { openDrawer } = useDrawer();
  const { tokens, tons, jwt, updateUserInfo } = useUserData();
  const [value, setValue] = useState("0.05");

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (regex.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleBlur = () => {
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue) && numericValue < 0.05) {
      setValue("0.05");
    } else if (
      numericValue > (activeCurrency.label == "akron" ? tokens : tons)
    ) {
      setValue((activeCurrency.label == "akron" ? tokens : tons).toString());
    }
  };

  useEffect(() => {
    handleBlur();
  }, [activeCurrency.label]);

  const handleWithdrawClick = async () => {
    if (jwt == null) return;

    const numericCredits = parseFloat(value);

    const balance = activeCurrency.label == "akron" ? tokens : tons;

    if (numericCredits >= 0.05 && numericCredits <= balance) {
      try {
        const reqBody = {
          amount: numericCredits,
          currency: activeCurrency.label == "akron" ? "jetton" : "ton",
        };
        const response = await fetch(SERVER_URL + "/main/withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(reqBody),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.code == 1) {
            openDrawer!(
              "resolved",
              "bottom",
              "Вывод добавлен в обработку. Скорость подтверждения зависит от загруженности сети TON."
            );
            await updateUserInfo(jwt);
            return;
          }
        }
        openDrawer!("rejected", "bottom", "Произошла ошибка во время вывода");
      } catch (error) {
        console.log(error);
        openDrawer!("rejected", "bottom", "Произошла ошибка во время вывода");
      }
    } else {
      openDrawer!(
        "rejected",
        "bottom",
        "Неккоректное количество " +
          activeCurrency.label.toUpperCase() +
          " для обмена"
      );
    }
  };

  return (
    <div className="withdraw">
      <div className="withdraw__inputBlock">
        <div className="withdraw__inputBlock-sup">
          <label className="withdraw__inputBlock-sup-label">Отдаете:</label>
          <div className="withdraw__inputBlock-sup-minValue">
            макс. {activeCurrency.label == "akron" ? tokens : tons}
          </div>
        </div>

        <div className="withdraw__inputBlock-inputWrapper">
          <input
            inputMode="decimal"
            type="text"
            min="0.05"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="withdraw__inputBlock-input"
          />
          <Select
            activeOption={activeCurrency}
            setActiveOption={setActiveCurrency}
            options={currencyOptions}
          />
        </div>

        <div className="withdraw__cuttedButtonWrapper">
          <CuttedButton text="вывод" callback={handleWithdrawClick} />
        </div>

        <div className="withdraw__bottomText">
          скорость вывода средств зависит от загруженности сети ton
        </div>
      </div>
    </div>
  );
}
