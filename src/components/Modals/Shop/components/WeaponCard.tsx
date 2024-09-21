import { useState } from "react";
import { CryptoButtons } from "../../../../ui/CryptoButtons/CryptoButtons";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import { WeaponType } from "../../../../ui/SlidingPills/types";
import { useTranslation } from "react-i18next";

type WeaponCardProps = WeaponType;

export function WeaponCard({
  title,
  imgSrc,
  additionalIncome,
  damage,
  charge,
  chargeSpeed,
  rateOfFire,
  durability,
  worth,
  level,
  rarity,
  callback,
}: WeaponCardProps) {
  const { t } = useTranslation();
  const [activeCurrency, setActiveCurrency] = useState("ton");

  return (
    <div className="weapon-card">
      <div className="weapon-card-title">
        <span className="weapon-card-title-rarity">{rarity}</span> -{" "}
        <span>{title}</span>
      </div>
      <div className="weapon-card-main">
        <div className="weapon-card-main-modelBlockWrapper">
          <div className="weapon-card-main-modelBlockWrapper-badge">
            {t("shopModal.weaponTab.level")} {level}
          </div>
          <img
            src={imgSrc}
            alt="model"
            className="weapon-card-main-modelBlock weapon-card-main-modelBlock--Weapon"
          />
        </div>

        <div className="weapon-card-main-info">
          <div className="weapon-card-main-info-list weapon-card-main-info-list--Weapon">
            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                {t("shopModal.weaponTab.additionalIncome")}:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {additionalIncome} TON
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                {" "}
                {t("shopModal.weaponTab.charge")}:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {charge} {t("global.point")}
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                {t("shopModal.weaponTab.damage")}:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {damage} {t("global.point")}
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                {t("shopModal.weaponTab.reload")}:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {chargeSpeed}\{t("global.minute")}
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                {t("shopModal.weaponTab.fireRate")}:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {rateOfFire}\{t("global.second")}
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                {t("shopModal.weaponTab.strength")}:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {durability} {t("global.point")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="weapon-card-footer">
        <div className="weapon-card-footer-priceBlock">
          <div className="weapon-card-footer-priceBlock-price">
            <div className="weapon-card-footer-priceBlock-price-key">
              {t("shopModal.weaponTab.price")}:
            </div>
            <div className="weapon-card-footer-priceBlock-price-value">
              {worth}
            </div>
          </div>

          <div className="weapon-card-main-info-btnWrapper">
            <CuttedButton
              text={t("shopModal.weaponTab.buy")}
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
