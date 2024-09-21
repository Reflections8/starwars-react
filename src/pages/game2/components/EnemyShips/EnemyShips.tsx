import "./styles/EnemyShips.css";
import bg from "./img/bg.png";
import shipImg1 from "./img/1.png";
import shipImg2 from "./img/2.png";
import shipImg3 from "./img/3.png";
import shipImg4 from "./img/4.png";
import xImg from "./img/X.svg";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const EnemyShips: FC<{ ships: { [key: string]: number } }> = ({
  ships,
}) => {
  const { t } = useTranslation();
  function checkShipsLeft(length: string) {
    // @ts-ignore
    if (!ships[length]) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <div className="enemyShips">
      <img src={bg} alt="" className="enemyShips__bg" />

      <div className="enemyShips__main">
        <div className="enemyShips__main-title">
          {t("battleships.rivalsFleet")}
        </div>
        <div className="enemyShips__main-content">
          {/* ITEM */}
          <div className="enemyShips__main-content-itemWrap">
            <div className="enemyShips__main-content-item">
              <img
                src={shipImg1}
                alt="ship1"
                className={`enemyShips__main-content-item-img ${
                  !checkShipsLeft("1") ? "halfTransparent" : ""
                }`}
              />
              {!checkShipsLeft("1") ? (
                <img
                  src={xImg}
                  alt="x"
                  className="enemyShips__main-content-item-xImg"
                />
              ) : null}
              <div className="enemyShips__main-content-item-value">
                {ships["1"]}
              </div>
            </div>
          </div>

          {/* ITEM */}
          <div className="enemyShips__main-content-itemWrap">
            <div className="enemyShips__main-content-item">
              <img
                src={shipImg2}
                alt="ship1"
                className={`enemyShips__main-content-item-img ${
                  !checkShipsLeft("2") ? "halfTransparent" : ""
                }`}
              />
              {!checkShipsLeft("2") ? (
                <img
                  src={xImg}
                  alt="x"
                  className="enemyShips__main-content-item-xImg"
                />
              ) : null}
              <div className="enemyShips__main-content-item-value">
                {ships["2"]}
              </div>
            </div>
          </div>

          {/* ITEM */}
          <div className="enemyShips__main-content-itemWrap">
            <div className="enemyShips__main-content-item">
              <img
                src={shipImg3}
                alt="ship1"
                className={`enemyShips__main-content-item-img ${
                  !checkShipsLeft("3") ? "halfTransparent" : ""
                }`}
              />
              {!checkShipsLeft("3") ? (
                <img
                  src={xImg}
                  alt="x"
                  className="enemyShips__main-content-item-xImg"
                />
              ) : null}
              <div className="enemyShips__main-content-item-value">
                {ships["3"]}
              </div>
            </div>
          </div>

          {/* ITEM */}
          <div className="enemyShips__main-content-itemWrap">
            <div className="enemyShips__main-content-item">
              <img
                src={shipImg4}
                alt="ship1"
                className={`enemyShips__main-content-item-img ${
                  !checkShipsLeft("4") ? "halfTransparent" : ""
                }`}
              />
              {!checkShipsLeft("4") ? (
                <img
                  src={xImg}
                  alt="x"
                  className="enemyShips__main-content-item-xImg"
                />
              ) : null}
              <div className="enemyShips__main-content-item-value">
                {ships["4"]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
