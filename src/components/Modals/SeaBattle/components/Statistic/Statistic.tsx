import { useEffect, useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import icon1 from "./img/1.svg";
import icon2 from "./img/2.svg";
import icon3 from "./img/3.svg";
import icon4 from "./img/4.svg";
import "./styles/Statistic.css";

import credit from "./img/credit.svg";
import creditMinus from "./img/credit__minus.svg";
import creditPlus from "./img/credit__plus.svg";

import akr from "./img/akr.svg";
import akrMinus from "./img/akr__minus.svg";
import akrPlus from "./img/akr__plus.svg";

import { useTranslation } from "react-i18next";
import {
  fetchStats,
  fetchUserPhoto,
  getMe,
} from "../../service/sea-battle.service";
import ton from "./img/ton.svg";
import tonMinus from "./img/ton__minus.svg";
import tonPlus from "./img/ton__plus.svg";

import defaultAva from "../../../../../icons/no_avatar.png";

type CurrencyStatType = {
  [key: string]: {
    title: string;
    plusIcon: string;
    minusIcon: string;
    totalIcon: string;
  };
};

type Stats = {
  games: number;
  wins: number;
  loses: number;
  ton_win: number;
  ton_lost: number;
  akronix_win: number;
  akronix_lost: number;
  credits_win: number;
  credits_lost: number;
  id: number;
};

export function Statistic() {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState("ton");

  const [photo, setPhoto] = useState(null);
  const [login, setLogin] = useState(localStorage.getItem("username"));
  const [stats, setStats] = useState<Stats | null>(null);

  async function loadPhoto(username: string) {
    const res = await fetchUserPhoto(username);
    // @ts-ignore
    setPhoto(res);
  }
  async function loadLogin() {
    const storageLogin = localStorage.getItem("username");
    if (storageLogin) {
      // @ts-ignore
      setLogin(storageLogin);
      loadPhoto(storageLogin);
      return;
    }

    const res = await getMe();
    if (res?.username) {
      localStorage.setItem("username", res.username);
      setLogin(res.username);
      loadPhoto(res.username);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      loadLogin();
    } else {
      loadPhoto(localStorage.getItem("username")!);
    }
  }, [login]);

  async function loadStats() {
    const res = await fetchStats();
    if (res?.stats) {
      setStats(res.stats);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const currencyStatEnum: CurrencyStatType = {
    credits: {
      title: t("battleshipsModal.statisticTab.credits"),
      plusIcon: creditPlus,
      minusIcon: creditMinus,
      totalIcon: credit,
    },
    akron: {
      title: "akron",
      plusIcon: akrPlus,
      minusIcon: akrMinus,
      totalIcon: akr,
    },
    ton: {
      title: "ton",
      plusIcon: tonPlus,
      minusIcon: tonMinus,
      totalIcon: ton,
    },
  };
  return (
    <div className="statistic">
      <CryptoButtons
        className="seaBattle__cryptoButtons"
        activeCurrency={currency}
        activeOptions={["credits", "akron", "ton"]}
        setActiveCurrency={setCurrency}
      />
      <div className="statistic__info">
        <div className="statistic__info-avatarBlock">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="statistic__info-avatarBlock-img check-image"
              width="56px"
            />
          ) : (
            <img
              src={defaultAva}
              alt=""
              className="statistic__info-avatarBlock-imgDefault"
              width="56px"
            />
          )}
        </div>

        <div className="statistic__info-divider"></div>

        <div className="statistic__info-login">@{login}</div>
      </div>
      <div className="statistic__grid">
        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              {t("battleshipsModal.statisticTab.duels")}:
            </div>
            <div className="statistic__grid-item-info-value">
              {stats?.games || 0}
            </div>
          </div>
          <img src={icon1} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              % {t("battleshipsModal.statisticTab.victories")}:
            </div>
            <div className="statistic__grid-item-info-value">
              {/* @ts-ignore */}
              {parseInt((stats?.wins / stats?.games) * 100) || 0}%
            </div>
          </div>
          <img src={icon2} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              {t("battleshipsModal.statisticTab.won")}:
            </div>
            <div className="statistic__grid-item-info-value">{stats?.wins}</div>
          </div>
          <img src={icon3} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              {t("battleshipsModal.statisticTab.lost")}:
            </div>
            <div className="statistic__grid-item-info-value">
              {stats?.loses}
            </div>
          </div>
          <img src={icon4} alt="icon" className="statistic__grid-item-img" />
        </div>

        {/* DYNAMIC STATS */}
        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              {t("battleshipsModal.statisticTab.won")}{" "}
              {currencyStatEnum[currency]?.title}:
            </div>
            <div className="statistic__grid-item-info-value">
              {/* @ts-ignore */}
              {stats?.[`${currency}_win`] || 0}
            </div>
          </div>
          <img
            src={currencyStatEnum[currency]?.plusIcon}
            alt="icon"
            className="statistic__grid-item-img"
          />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              {t("battleshipsModal.statisticTab.lost")}{" "}
              {currencyStatEnum[currency]?.title}:
            </div>
            <div className="statistic__grid-item-info-value">
              {/* @ts-ignore */}
              {stats?.[`${currency}_lost`] || 0}
            </div>
          </div>
          <img
            src={currencyStatEnum[currency]?.minusIcon}
            alt="icon"
            className="statistic__grid-item-img"
          />
        </div>

        {/* ITEM */}
        <div className="statistic__grid-item">
          <div className="statistic__grid-item-info">
            <div className="statistic__grid-item-info-key">
              {t("battleshipsModal.statisticTab.result")}:
            </div>
            <div className="statistic__grid-item-info-value">
              {/* @ts-ignore */}
              {stats?.[`${currency}_win`] - stats?.[`${currency}_lost`]}
            </div>
          </div>
          <img
            src={currencyStatEnum[currency]?.totalIcon}
            alt="icon"
            className="statistic__grid-item-img"
          />
        </div>
      </div>
    </div>
  );
}
