import { useDrawer } from "../../../../context/DrawerContext";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import {
  StoreModelType,
  StoreWeaponType,
} from "../../../../ui/SlidingPills/types";
import { useUserData } from "../../../../UserDataService.tsx";

export function StoreCardModel({
  title,
  needRestoration,
  combatPerfomanceReduction,
  strength,
  strengthUpgrade,
  reload,
  reloadUpgrade,
  charge,
  chargeUpgrade,
  healthCurrent,
  healthMax,
  imgSrc,
}: StoreModelType) {
  const { openDrawer } = useDrawer();
  return (
    <div
      className={`player-card ${
        needRestoration ? "player-card--NeedRestoration" : ""
      }`}
    >
      <div className="player-card-title">{title}</div>
      <div className="player-card-subtitle">
        <span> Боевые показатели:</span>
        <span className="red">
          {combatPerfomanceReduction ? ` ${combatPerfomanceReduction}%` : ""}
        </span>
      </div>
      <div className="player-card-main">
        <img src={imgSrc} alt="model" className="player-card-main-modelBlock" />
        <div className="player-card-main-info">
          <div className="player-card-main-info-list">
            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                сила(урон):
              </div>
              <div className="player-card-main-info-list-item-value">
                {strength}{" "}
                {needRestoration ? null : (
                  <span className="green">(+{strengthUpgrade}) </span>
                )}
                ед.
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                перезарядка:
              </div>
              <div className="player-card-main-info-list-item-value">
                {reload}{" "}
                {needRestoration ? null : (
                  <span className="green">(+{reloadUpgrade})%</span>
                )}
                /мин
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">заряд:</div>
              <div className="player-card-main-info-list-item-value">
                {charge}{" "}
                {needRestoration ? null : (
                  <span className="green">(+{chargeUpgrade})</span>
                )}
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                здоровье:
              </div>
              <div className="player-card-main-info-list-item-value">
                <span className="red">{healthCurrent}</span>{" "}
                <span className="blue">\{healthMax}</span>
              </div>
            </div>

            <div
              className={`cuttedButtonContainer store-card-main-info-btnWrapper ${
                !needRestoration ? "halfTransparent" : ""
              }`}
            >
              <CuttedButton
                size="small"
                text={"Исцелить"}
                callback={() => {
                  openDrawer!("heal");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoreCardWeapon({
  title,
  rarity,
  level,
  needRestoration,
  additionalIncomeCurrent,
  additionalIncomeMax,
  damage,
  charge,
  reload,
  rateOfFire,
  durabilityCurrent,
  durabilityMax,
  imgSrc,
}: StoreWeaponType) {
  const { selectGun } = useUserData();
  const { openDrawer } = useDrawer();

  return (
    <div
      className={`store-card ${
        needRestoration ? "store-card--NeedRestoration" : ""
      }`}
    >
      <div className="store-card-title">
        <span className="store-card-title-rarity">{rarity}</span> -{" "}
        <span>{title}</span>
      </div>
      <div className="store-card-main">
        <div className="store-card-main-modelBlockWrapper">
          <div className="store-card-main-modelBlockWrapper-badge">
            Уровень {level}
          </div>
          <img
            src={imgSrc}
            alt="model"
            className="store-card-main-modelBlock store-card-main-modelBlock--store"
          />
        </div>

        <div className="store-card-main-info">
          <div className="store-card-main-info-list store-card-main-info-list--store">
            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                доп.доход:
              </div>
              <div className="store-card-main-info-list-item-value">
                {additionalIncomeCurrent}/{additionalIncomeMax}
              </div>
            </div>
            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">урон:</div>
              <div className="store-card-main-info-list-item-value">
                {damage} ед.
              </div>
            </div>

            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">заряд:</div>
              <div className="store-card-main-info-list-item-value">
                {charge} ед.
              </div>
            </div>

            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                перезарядка:
              </div>
              <div className="store-card-main-info-list-item-value">
                {reload}%/мин
              </div>
            </div>

            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                скр.стрельбы:
              </div>
              <div className="store-card-main-info-list-item-value">
                {rateOfFire}/сек
              </div>
            </div>
            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                прочность:
              </div>
              <div className="store-card-main-info-list-item-value">
                <span>{durabilityCurrent}</span>
                <span>\{durabilityMax}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="store-card-footer">
        <div className="store-card__body-main-block-cuttedBtnWrapper">
          <CuttedButton
            size="small"
            className={
              level == 1 || durabilityCurrent === durabilityMax
                ? "halfTransparent"
                : ""
            }
            text={"Починить"}
            callback={() => {
              selectGun(level);
              openDrawer!("repair");
            }}
          />
        </div>

        <div className="store-card__body-main-block-cuttedBtnWrapper">
          <CuttedButton
            size="small"
            text={"Улучшить"}
            callback={() => {
              selectGun(level);
              openDrawer!("upgrade");
            }}
          />
        </div>
      </div>
    </div>
  );
}
