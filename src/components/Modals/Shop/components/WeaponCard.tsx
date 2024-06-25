import { useState } from "react";
import { CryptoButtons } from "../../../../ui/CryptoButtons/CryptoButtons";
import { WeaponType } from "../../../../ui/SlidingPills/types";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";

type WeaponCardProps = WeaponType;

export function WeaponCard({
  title,
  imgSrc,
  worth,
  chargeSpeed,
  damage,
  rateOfFire,
  weaponYield,
  callback,
}: WeaponCardProps) {
  const [activeCurrency, setActiveCurrency] = useState("credits");

  return (
    <div className="weapon-card">
      <div className="weapon-card__title">{title}</div>
      <img src={imgSrc} alt="model" className="weapon-card__img" />

      <div className="weapon-card-list">
        <div className="weapon-card-list-item">
          <div className="weapon-card-list-item-key">урон:</div>
          <div className="weapon-card-list-item-value">{damage}</div>
        </div>

        <div className="weapon-card-list-item">
          <div className="weapon-card-list-item-key">доходность:</div>
          <div className="weapon-card-list-item-value">{weaponYield}</div>
        </div>

        <div className="weapon-card-list-item">
          <div className="weapon-card-list-item-key">скр. стрельбы:</div>
          <div className="weapon-card-list-item-value">{rateOfFire}\сек</div>
        </div>

        <div className="weapon-card-list-item">
          <div className="weapon-card-list-item-key">скр. заряда:</div>
          <div className="weapon-card-list-item-value">{chargeSpeed}\мин</div>
        </div>
      </div>

      <div className="weapon-card-footer">
        <div className="weapon-card-list-item">
          <div className="weapon-card-list-item-key">стоимость:</div>
          <div className="weapon-card-list-item-value">{worth}</div>
        </div>

        <div className="weapon-card-footer-btnWrapper">
          <CuttedButton text={"Купить"} callback={callback} />
        </div>
      </div>

      <CryptoButtons
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />
    </div>
  );
}
