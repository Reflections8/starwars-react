import { useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import "./styles/Bet.css";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { BetTypeEnum } from "../../types/enum";
import { useDrawer } from "../../../../../context/DrawerContext";
import { useBattleships } from "../../../../../context/BattleshipsContext";
import { useTranslation } from "react-i18next";
import { useUserData } from "../../../../../UserDataService";

export function Bet() {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const { credits, tokens: akronix, tons } = useUserData();

  //   const [activeCurrency, setActiveCurrency] = useState("credits");
  const [bet, setBet] = useState(0);

  const { activeCurrency, setActiveCurrency, sendMessage } = useBattleships();

  async function createRoom() {
    if (!bet) {
      openDrawer!(
        "rejected",
        "bottom",
        t("battleshipsModal.betTab.enterBetAmount")
      );
      return;
    }

    sendMessage({
      type: "create_room",
      message: {
        bet_type: BetTypeEnum[activeCurrency as keyof typeof BetTypeEnum],
        bet_amount: bet,
      },
    });
  }

  function handleActiveCurrency() {
    if (activeCurrency === "credits") return credits;
    if (activeCurrency === "akronix") return akronix;
    if (activeCurrency === "ton") return tons;
  }

  function handleCreateDuel(e: any) {
    if (activeCurrency === "credits") {
      if (credits < bet) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    if (activeCurrency === "akronix") {
      if (akronix < bet) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    if (activeCurrency === "ton") {
      if (tons < bet) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    e.stopPropagation();
    createRoom();
  }
  return (
    <div className="bet">
      <CryptoButtons
        className="seaBattle__cryptoButtons"
        activeOptions={["credits", "akronix", "ton"]}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />

      <div className="bet__title">
        {t("battleshipsModal.betTab.createYourOwnDuel")}!
      </div>

      <div className="bet__inputBlock bet__inputBlock--CurrentBalance">
        <div className="bet__inputBlock-sup">
          <label className="bet__inputBlock-sup-label">
            {t("global.currentBalance")}:
          </label>
        </div>

        <div className="bet__inputBlock-inputWrapper--CurrentBalance">
          <span>{handleActiveCurrency()}</span>
          <div className="bet__inputBlock-postfix">
            {activeCurrency.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="bet__inputBlock">
        <div className="bet__inputBlock-sup">
          <label className="bet__inputBlock-sup-label">
            1.{t("battleshipsModal.betTab.yourBet")}:
          </label>
        </div>

        <div className="bet__inputBlock-inputWrapper">
          <input
            type="decimal"
            value={bet}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setBet(0);
                return;
              }
              const numericValue = Number(value);
              if (!isNaN(numericValue)) {
                setBet(numericValue);
              }
            }}
            className={`bet__inputBlock-input ${activeCurrency}`}
          />
          <div className="bet__inputBlock-postfix">
            {activeCurrency.toUpperCase()}
          </div>
        </div>
      </div>

      <CuttedButton
        className="bet__cuttedButton"
        text={t("battleshipsModal.betTab.createDuel")}
        callback={(e) => {
          handleCreateDuel(e);
        }}
      />

      <div className="bet__footerText">
        {t("battleshipsModal.betTab.infoText")}
      </div>
    </div>
  );
}
