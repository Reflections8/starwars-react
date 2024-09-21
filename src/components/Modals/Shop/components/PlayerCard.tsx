import { useState } from "react";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import { ModelTypeNew } from "../../../../ui/SlidingPills/types";
import { CryptoButtons } from "../../../../ui/CryptoButtons/CryptoButtons";
import { useTranslation } from "react-i18next";

type PlayerCardProps = ModelTypeNew;

export function PlayerCard({
  title,
  strength,
  reloadSpeed,
  health,
  price,
  imgSrc,
  callback,
}: PlayerCardProps) {
  const { t } = useTranslation();
  const [activeCurrency, setActiveCurrency] = useState("ton");

  return (
    <div className="player-card">
      <div className="player-card-title">
        <span>{title}</span>
      </div>
      <div className="player-card-main">
        <div className="player-card-main-modelBlockWrapper">
          <img
            src={imgSrc}
            alt="model"
            className="player-card-main-modelBlock player-card-main-modelBlock--Player"
          />
        </div>

        <div className="player-card-main-info">
          <div className="player-card-main-info-list player-card-main-info-list--Player">
            {/* ITEM */}
            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                {t("shopModal.playerTab.powerDamage")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                {strength} {t("global.point")}
              </div>
            </div>

            {/* ITEM */}
            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                {t("shopModal.playerTab.reloadAcceleration")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                {reloadSpeed}%
              </div>
            </div>

            {/* ITEM */}
            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                {t("shopModal.playerTab.health")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                {health} {t("global.point")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="player-card-footer">
        <div className="player-card-footer-priceBlock">
          <div className="player-card-footer-priceBlock-price">
            <div className="player-card-footer-priceBlock-price-key">
              {t("shopModal.playerTab.price")}:
            </div>
            <div className="player-card-footer-priceBlock-price-value">
              {price} {activeCurrency.toString().toUpperCase()}
            </div>
          </div>

          <div className="player-card-main-info-btnWrapper">
            <CuttedButton
              text={t("shopModal.playerTab.buy")}
              callback={callback}
            />
          </div>
        </div>

        <CryptoButtons
          className="metrics__tabs"
          soonOptions={["credits", "akron"]}
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
        />
      </div>
    </div>
  );
}
