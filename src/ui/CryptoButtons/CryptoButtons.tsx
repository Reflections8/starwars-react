import "./styles/cryptoButtons.css";
import creditsIcon from "./img/credit.svg";
import woopyIcon from "./img/woopy.svg";
import tonIcon from "./img/ton.svg";

type CryptoButtonsProps = {
  activeCurrency: string;
  setActiveCurrency: (activeCurrency: string) => void;
  className?: string;
  soonOptions?: string[];
  activeOptions?: string[];
};

export function CryptoButtons({
  activeCurrency,
  setActiveCurrency,
  className,
  activeOptions = ["credits", "woopy", "ton"],
  soonOptions = [],
}: CryptoButtonsProps) {
  return (
    <div className={`cryptoButtons ${className || ""}`}>
      {activeOptions.includes("credits") ? (
        <button
          className={`cryptoButtons__btn ${
            activeCurrency === "credits" ? "cryptoButtons__btn--Active" : ""
          } ${soonOptions.includes("credits") ? "cryptoButtons__btn--Soon" : ""}`}
          onClick={() => {
            setActiveCurrency("credits");
          }}
        >
          <img
            src={creditsIcon}
            alt="credit"
            className="cryptoButtons__btn-icon"
          />
          <div className="cryptoButtons__btn-text">credits</div>
        </button>
      ) : null}

      {activeOptions.includes("woopy") ? (
        <button
          className={`cryptoButtons__btn ${
            activeCurrency === "woopy" ? "cryptoButtons__btn--Active" : ""
          } ${soonOptions.includes("woopy") ? "cryptoButtons__btn--Soon" : ""}`}
          onClick={() => {
            setActiveCurrency("woopy");
          }}
        >
          <img
            src={woopyIcon}
            alt="credit"
            className="cryptoButtons__btn-icon"
          />
          <div className="cryptoButtons__btn-text">woopy</div>
        </button>
      ) : null}

      {activeOptions.includes("ton") ? (
        <button
          className={`cryptoButtons__btn ${
            activeCurrency === "ton" ? "cryptoButtons__btn--Active" : ""
          } ${soonOptions.includes("ton") ? "cryptoButtons__btn--Soon" : ""}`}
          onClick={() => {
            setActiveCurrency("ton");
          }}
        >
          <img src={tonIcon} alt="credit" className="cryptoButtons__btn-icon" />
          <div className="cryptoButtons__btn-text">ton</div>
        </button>
      ) : null}
    </div>
  );
}
