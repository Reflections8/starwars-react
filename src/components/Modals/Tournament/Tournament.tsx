import { useState } from "react";
import { useTranslation } from "react-i18next";
import creditIcon from "./img/credit.svg";
import headerBg from "./img/header-bg.png";
import top1Img from "./img/top1.png";
import top2Img from "./img/top2.png";
import top3Img from "./img/top3.png";
import top4Img from "./img/top4.png";
import "./styles/tournament.css";

export function Tournament() {
  const { t, i18n } = useTranslation();
  const [tournamentReward] = useState("$5000");

  const mockList = [
    {
      id: 1,
      login: "agshdjasdahsjdasd",
      reward: 2_252_560_000,
    },
    {
      id: 2,
      login: "some_very_very_long_nickname",
      reward: 2_252_000_000,
    },
    {
      id: 3,
      login: "rflxns8",
      reward: 500_250_000,
    },
    {
      id: 4,
      login: "nick",
      reward: 500_000_000,
    },
    {
      id: 5,
      login: "name",
      reward: 25_250_250,
    },

    {
      id: 6,
      login: "name",
      reward: 25_000_250,
    },
    {
      id: 7,
      login: "name",
      reward: 1_500_000,
    },
    {
      id: 8,
      login: "name",
      reward: 1_000_000,
    },
    {
      id: 9,
      login: "name",
      reward: 999_999,
    },

    {
      id: 10,
      login: "name",
      reward: 240000,
    },

    {
      id: 11,
      login: "name",
      reward: 240000,
    },

    {
      id: 12,
      login: "name",
      reward: 240000,
    },
  ];

  function getPlaceImg(place: number) {
    if (place === 1) {
      return top1Img;
    }
    if (place === 2) {
      return top2Img;
    }
    if (place === 3) {
      return top3Img;
    } else {
      return top4Img;
    }
  }

  function calculateFontSizeClass(place: number) {
    if (place < 10) return "";
    if (place >= 10 && place < 99) return "px-11";
    if (place >= 100 && place < 1000) return "px-8";
    if (place >= 1000 && place < 10000) return "px-6";
    if (place >= 10000) return "px-5";
  }

  function formatRewardNumber(reward: number) {
    if (reward === null || reward === undefined) return "";

    if (reward >= 1_000_000_000) {
      return (
        (reward / 1_000_000_000).toFixed(3).replace(/\.?0+$/, "") +
        (i18n.language === "en" ? " B" : " МЛРД")
      );
    } else if (reward >= 1_000_000) {
      return (
        (reward / 1_000_000).toFixed(3).replace(/\.?0+$/, "") +
        (i18n.language === "en" ? " M" : " МЛН")
      );
    } else {
      return reward.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }

  return (
    <div className="tournament">
      <div className="tournament__header">
        <img src={headerBg} className="tournament__header-bg" />

        <div className="tournament__header-content">
          <div className="tournament__header-content-key">
            {t("tournamentsModal.tournamentFor")}:
          </div>
          <div className="tournament__header-content-value">
            {tournamentReward}
          </div>
        </div>
      </div>

      <div className="tournament__text">{t("tournamentsModal.text")}</div>

      <div className="modal__scrollContainer">
        <div className="tournament__list">
          {mockList.map((item, index) => {
            const place = index + 1;
            return (
              <div className={`tournament__list-item place-${place}`}>
                <div className="tournament__list-item-imgWrapper">
                  <img
                    src={getPlaceImg(place)}
                    alt={String(place)}
                    className="tournament__list-item-imgWrapper-img"
                  />
                  <div
                    className={`tournament__list-item-imgWrapper-text ${calculateFontSizeClass(
                      place
                    )}`}
                  >
                    {place}
                  </div>
                </div>
                <div className="tournament__list-item-login">{item.login}</div>
                <div className="tournament__list-item-reward">
                  <img
                    src={creditIcon}
                    className="tournament__list-item-login-reward-icon"
                  />
                  <div
                    className="tournament__list-item-reward-amount"
                    title={item?.reward
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  >
                    {formatRewardNumber(item?.reward)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
