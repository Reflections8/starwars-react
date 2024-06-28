import "./styles/cryptoButtons.css";
import creditsIcon from "./img/credit.svg";
import woopyIcon from "./img/woopy.svg";
import tonIcon from "./img/ton.svg";

type CryptoButtonsProps = {
  activeCurrency: string;
  setActiveCurrency: (activeCurrency: string) => void;
  className?: string;
};

export function CryptoButtons({
  activeCurrency,
  setActiveCurrency,
  className,
}: CryptoButtonsProps) {
  return (
    <div className={`cryptoButtons ${className || ""}`}>
      <button
        className={`cryptoButtons__btn ${
          activeCurrency === "credits" ? "cryptoButtons__btn--Active" : ""
        }`}
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

      <button
        className={`cryptoButtons__btn ${
          activeCurrency === "woopy" ? "cryptoButtons__btn--Active" : ""
        }`}
        onClick={() => {
          setActiveCurrency("woopy");
        }}
      >
        <img src={woopyIcon} alt="credit" className="cryptoButtons__btn-icon" />
        <div className="cryptoButtons__btn-text">woopy</div>
      </button>

      <button
        className={`cryptoButtons__btn ${
          activeCurrency === "ton" ? "cryptoButtons__btn--Active" : ""
        }`}
        onClick={() => {
          setActiveCurrency("ton");
        }}
      >
        <img src={tonIcon} alt="credit" className="cryptoButtons__btn-icon" />
        <div className="cryptoButtons__btn-text">ton</div>
      </button>
    </div>
  );
}
