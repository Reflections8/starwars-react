import { useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import "./styles/Bet.css";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { BetTypeEnum } from "../../types/enum";
import { useDrawer } from "../../../../../context/DrawerContext";
import { useBattleships } from "../../../../../context/BattleshipsContext";
import { useTranslation } from "react-i18next";

export function Bet() {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const { sendMessage } = useBattleships();

  const [activeCurrency, setActiveCurrency] = useState("credits");
  const [bet, setBet] = useState(0);

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
              setBet(Number(e.target.value));
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
          e.stopPropagation();
          createRoom();
        }}
      />

      <div className="bet__footerText">
        {t("battleshipsModal.betTab.infoText")}
      </div>
    </div>
  );
}
