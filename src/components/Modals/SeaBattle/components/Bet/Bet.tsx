import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBattleships } from "../../../../../context/BattleshipsContext";
import { useDrawer } from "../../../../../context/DrawerContext";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { useUserData } from "../../../../../UserDataService";
import { BetTypeEnum } from "../../types/enum";
import { CurrentBalace } from "../CurrentBalance";
import "./styles/Bet.css";

export function Bet() {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const { credits, tokens: akronix, tons } = useUserData();

  //   const [activeCurrency, setActiveCurrency] = useState("credits");
  const [bet, setBet] = useState<number | null | string>(null);

  const { activeCurrency, setActiveCurrency, sendMessage } = useBattleships();

  async function createRoom() {
    if (!Number(bet)) {
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
        bet_amount: Number(bet),
      },
    });
  }

  function handleCreateDuel(e: any) {
    if (activeCurrency === "credits") {
      if (credits < Number(bet)) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    if (activeCurrency === "akron") {
      if (akronix < Number(bet)) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    if (activeCurrency === "ton") {
      if (tons < Number(bet)) {
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
        activeOptions={["credits", "akron", "ton"]}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />

      <div className="bet__title">
        {t("battleshipsModal.betTab.createYourOwnDuel")}!
      </div>

      <CurrentBalace
        activeCurrency={activeCurrency}
        credits={credits}
        akronix={akronix}
        tons={tons}
      />

      <div className="bet__inputBlock">
        <div className="bet__inputBlock-sup">
          <label className="bet__inputBlock-sup-label">
            1.{t("battleshipsModal.betTab.yourBet")}:
          </label>
        </div>

        <div className="bet__inputBlock-inputWrapper">
          <input
            type="text"
            value={bet || ""}
            onChange={(e) => {
              const value = e.target.value;

              // Регулярное выражение для проверки: целое положительное число или положительное число с плавающей запятой
              const regex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;

              if (value === "") {
                setBet(null);
                return;
              }

              if (regex.test(value)) {
                setBet(value);
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
