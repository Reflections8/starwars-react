import "../styles/resources.css";
import topBg from "../img/resources/top-bg.svg";
import mainBg from "../img/resources/main-bg.png";
import bottomBg from "../img/resources/bottom-bg.svg";
import creditsIcon from "../img/resources/credit.svg";
import akronIcon from "../img/resources/akron.svg";
import tonIcon from "../img/resources/ton.svg";
import highlighCurrency from "../video/currency.svg";
import searchBg from "../img/resources/search-bg.svg";
import searchIcon from "../img/resources/search.svg";
import searchCancelIcon from "../img/resources/search-cancel-bg.svg";
import { useBattleships } from "../../../context/BattleshipsContext";

type ResourcesProps = {
  credits: number;
  akron: number;
  ton: number;
};

export function Resources({ credits, akron, ton }: Partial<ResourcesProps>) {
  const { handleDeclineMyRooms, searchingDuel } = useBattleships();

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
          <img src={highlighCurrency} alt="" className="highlighter credits" />
          <img
            src={mainBg}
            alt="main-bg"
            className="resources__item-main-bg highlighterParent credits"
          />
          <div className="resources__item-main-value">{credits}</div>
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

      {/* AKRON */}
      <div className="resources__item">
        <div className="resources__item-top">
          <img src={topBg} alt="top-bg" className="resources__item-top-bg" />
          <img
            src={akronIcon}
            alt="top-bg"
            className="resources__item-top-icon"
          />
        </div>

        <div className="resources__item-main ">
          <img src={highlighCurrency} alt="" className="highlighter akron" />
          <img
            src={mainBg}
            alt="main-bg"
            className="resources__item-main-bg highlighterParent akron"
          />
          <div className="resources__item-main-value">{akron}</div>
        </div>

        <div className="resources__item-bottom">
          <img
            src={bottomBg}
            alt="main-bg"
            className="resources__item-bottom-bg"
          />
          <div className="resources__item-bottom-value">AKRON</div>
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
          <img src={highlighCurrency} alt="" className="highlighter ton" />
          <img
            src={mainBg}
            alt="main-bg"
            className="highlighterParent ton resources__item-main-bg"
          />
          <div className="resources__item-main-value">{ton}</div>
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

      {searchingDuel ? (
        <div className="resources__searchWrapper">
          <div className={`resources__search`}>
            <img src={searchBg} alt="" className="resources__search-bg" />

            <img src={searchIcon} alt="" className="resources__search-icon" />
            <div className="resources__search-key">Идет поиск</div>
          </div>
          <img
            src={searchCancelIcon}
            alt=""
            className="resources__searchCancel"
            onClick={handleDeclineMyRooms}
          />
        </div>
      ) : null}
    </div>
  );
}
