import { useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import "./styles/Bet.css";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";

export function Bet() {
  const [activeCurrency, setActiveCurrency] = useState("ton");
  const [bet, setBet] = useState(0);
  return (
    <div className="bet">
      <CryptoButtons
        className="seaBattle__cryptoButtons"
        activeOptions={["credits", "akronix", "ton"]}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />

      <div className="bet__title">создайте свою собственную дуэль!</div>

      <div className="bet__inputBlock">
        <div className="bet__inputBlock-sup">
          <label className="bet__inputBlock-sup-label">1.ваша ставка:</label>
        </div>

        <div className="bet__inputBlock-inputWrapper">
          <input
            type="decimal"
            value={bet}
            onChange={(e) => {
              setBet(Number(e.target.value));
            }}
            className="bet__inputBlock-input"
          />
          <div className="bet__inputBlock-postfix">SOL</div>
        </div>
      </div>

      <CuttedButton className="bet__cuttedButton" text="Создать дуэль" />

      <div className="bet__footerText">
        после создания дуэли вы становитесь в очередь и ждете пока вам кинут
        вызов. У вас будет 2 минуты что бы принять вызов или отказаться
      </div>
    </div>
  );
}
