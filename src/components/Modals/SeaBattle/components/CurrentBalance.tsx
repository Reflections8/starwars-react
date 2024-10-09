import { useTranslation } from "react-i18next";
import "./CurrentBalance.css";
import walletIcon from "./wallet-icon.svg";

type CurrentBalanceProps = {
  activeCurrency: string;
  credits: number;
  akronix: number;
  tons: number;
};
export function CurrentBalace({
  activeCurrency,
  credits,
  tons,
  akronix,
}: CurrentBalanceProps) {
  const { t } = useTranslation();
  function getActiveCurrency() {
    if (activeCurrency === "credits") return credits;
    if (activeCurrency === "akron") return akronix;
    if (activeCurrency === "ton") return tons;
  }

  return (
    <div className="currentBalanceWrapper">
      <div className="currentBalanceWrapper__start">
        <img
          src={walletIcon}
          alt="wallet"
          className="currentBalanceWrapper__start-icon"
        />
        <div className="currentBalanceWrapper__start-text">
          {t("global.currentBalance")}:
        </div>
      </div>

      <div className="currentBalanceWrapper__end">
        <div className="currentBalanceWrapper__end-value">
          {getActiveCurrency()}
        </div>
        <div className="currentBalanceWrapper__end-currency">
          {activeCurrency}
        </div>
      </div>
    </div>
  );
}
