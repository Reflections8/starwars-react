import { useState } from "react";
import { CryptoButtons } from "../../../../ui/CryptoButtons/CryptoButtons";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import { WeaponType } from "../../../../ui/SlidingPills/types";

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
            Уровень {level}
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
                доп.доход:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {additionalIncome} TON
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">заряд:</div>
              <div className="weapon-card-main-info-list-item-value">
                {charge} ед.
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">урон:</div>
              <div className="weapon-card-main-info-list-item-value">
                {damage} ед.
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                перезарядка:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {chargeSpeed}\мин.
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                скр. стрельбы:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {rateOfFire}\сек.
              </div>
            </div>

            {/* ITEM */}
            <div className="weapon-card-main-info-list-item">
              <div className="weapon-card-main-info-list-item-key">
                прочность:
              </div>
              <div className="weapon-card-main-info-list-item-value">
                {durability} ед.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="weapon-card-footer">
        <div className="weapon-card-footer-priceBlock">
          <div className="weapon-card-footer-priceBlock-price">
            <div className="weapon-card-footer-priceBlock-price-key">цена:</div>
            <div className="weapon-card-footer-priceBlock-price-value">
              {worth}
            </div>
          </div>

          <div className="weapon-card-main-info-btnWrapper">
            <CuttedButton text={"Купить"} callback={callback} />
          </div>
        </div>

        <CryptoButtons
          className="metrics__tabs"
          soonOptions={["credits", "woopy"]}
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
        />
      </div>
    </div>
  );
}
