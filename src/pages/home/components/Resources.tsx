import { formatNumberWithCommas } from "../../../utils";
import "../styles/resources.css";
import topBg from "../img/resources/top-bg.svg";
import mainBg from "../img/resources/main-bg.png";
import bottomBg from "../img/resources/bottom-bg.svg";
import creditsIcon from "../img/resources/credit.svg";
import coinIcon from "../img/resources/coin.svg";
import tonIcon from "../img/resources/ton.svg";

type ResourcesProps = {
  credits: number;
  woopy: number;
  ton: number;
};

export function Resources({ credits, woopy, ton }: Partial<ResourcesProps>) {
  // {formatNumberWithCommas(credits)}
  return (
    <div className="resources">
      {/* CREDITS */}
      <div className="resources__item">
        <div className="resources__item-top">
          <img src={topBg} alt="top-bg" className="resources__item-top-bg" />
          <img
            src={creditsIcon}
            alt="top-bg"
            className="resources__item-top-icon"
          />
        </div>

        <div className="resources__item-main">
          <img src={mainBg} alt="main-bg" className="resources__item-main-bg" />
          <div className="resources__item-main-value">
            {formatNumberWithCommas(credits)}
          </div>
        </div>

        <div className="resources__item-bottom">
          <img
            src={bottomBg}
            alt="main-bg"
            className="resources__item-bottom-bg"
          />
          <div className="resources__item-bottom-value">CREDITS</div>
        </div>
      </div>

      {/* WOOPY */}
      <div className="resources__item">
        <div className="resources__item-top">
          <img src={topBg} alt="top-bg" className="resources__item-top-bg" />
          <img
            src={coinIcon}
            alt="top-bg"
            className="resources__item-top-icon"
          />
        </div>

        <div className="resources__item-main">
          <img src={mainBg} alt="main-bg" className="resources__item-main-bg" />
          <div className="resources__item-main-value">
            {formatNumberWithCommas(woopy)}
          </div>
        </div>

        <div className="resources__item-bottom">
          <img
            src={bottomBg}
            alt="main-bg"
            className="resources__item-bottom-bg"
          />
          <div className="resources__item-bottom-value">WOOPY</div>
        </div>
      </div>

      {/* TON */}
      <div className="resources__item">
        <div className="resources__item-top">
          <img src={topBg} alt="top-bg" className="resources__item-top-bg" />
          <img
            src={tonIcon}
            alt="top-bg"
            className="resources__item-top-icon"
          />
        </div>

        <div className="resources__item-main">
          <img src={mainBg} alt="main-bg" className="resources__item-main-bg" />
          <div className="resources__item-main-value">
            {formatNumberWithCommas(ton)}
          </div>
        </div>

        <div className="resources__item-bottom">
          <img
            src={bottomBg}
            alt="main-bg"
            className="resources__item-bottom-bg"
          />
          <div className="resources__item-bottom-value">TON</div>
        </div>
      </div>
    </div>
  );
}
