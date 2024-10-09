import { useTranslation } from "react-i18next";
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
  type,
}: StoreModelType) {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const { selectHealingCharacter } = useUserData();
  return (
    <div
      className={`player-card ${
        needRestoration ? "player-card--NeedRestoration" : ""
      }`}
    >
      <div className="player-card-title">{title}</div>
      <div className="player-card-subtitle">
        <span> {t("shopModal.combatIndicators")}:</span>
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
                {t("shopModal.playerTab.powerDamage")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                {strength}{" "}
                {needRestoration ? null : (
                  <span className="green">(+{strengthUpgrade}) </span>
                )}
                {t("global.point")}
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                {t("shopModal.weaponTab.reload")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                {reload}
                {""}
                {needRestoration ? null : (
                  <span className="green"> (+{reloadUpgrade})</span>
                )}
                %/{t("global.minute")}
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                {t("shopModal.weaponTab.charge")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                {charge}{" "}
                {needRestoration ? null : (
                  <span className="green">(+{chargeUpgrade})</span>
                )}
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                {t("shopModal.playerTab.health")}:
              </div>
              <div className="player-card-main-info-list-item-value">
                <span className="red">{healthCurrent.toFixed(3)}</span>{" "}
                <span className="blue">\{healthMax.toFixed(3)}</span>
              </div>
            </div>

            <div
              className={`cuttedButtonContainer store-card-main-info-btnWrapper ${
                !needRestoration ? "halfTransparent" : ""
              }`}
            >
              <CuttedButton
                size="small"
                text={t("healModal.buttonText")}
                callback={() => {
                  selectHealingCharacter(type);
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
  max_charge,
  reload,
  rateOfFire,
  durabilityCurrent,
  durabilityMax,
  imgSrc,
  blasterLevel,
}: StoreWeaponType) {
  const { t } = useTranslation();
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
            {t("shopModal.storeTab.level")} {level}
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
                {t("shopModal.storeTab.additionalIncome")}:
              </div>
              <div className="store-card-main-info-list-item-value">
                {blasterLevel == 1 || additionalIncomeCurrent == 0
                  ? 0
                  : additionalIncomeCurrent.toFixed(3)}
                /{additionalIncomeMax}
              </div>
            </div>
            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                {t("shopModal.storeTab.damage")}:
              </div>
              <div className="store-card-main-info-list-item-value">
                {damage} {t("global.point")}
              </div>
            </div>

            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                {t("shopModal.storeTab.charge")}:
              </div>
              <div className="store-card-main-info-list-item-value">
                {max_charge} {t("global.point")}
              </div>
            </div>

            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                {t("shopModal.storeTab.reload")}:
              </div>
              <div className="store-card-main-info-list-item-value">
                {reload}%/{t("global.minute")}
              </div>
            </div>

            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                {t("shopModal.storeTab.fireRate")}:
              </div>
              <div className="store-card-main-info-list-item-value">
                {rateOfFire}/{t("global.second")}
              </div>
            </div>
            {/* ITEM */}
            <div className="store-card-main-info-list-item">
              <div className="store-card-main-info-list-item-key">
                {t("shopModal.storeTab.strength")}:
              </div>
              {blasterLevel == 1 ? (
                <div className="store-card-main-info-list-item-value">
                  <span>♾️</span>
                </div>
              ) : (
                <div className="store-card-main-info-list-item-value">
                  <span>{durabilityCurrent}</span>
                  <span>\{durabilityMax}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="store-card-footer">
        <div className="store-card__body-main-block-cuttedBtnWrapper">
          <CuttedButton
            size="small"
            className={
              blasterLevel == 1 || durabilityCurrent === durabilityMax
                ? "halfTransparent"
                : ""
            }
            text={t("shopModal.storeTab.fixUp")}
            callback={() => {
              selectGun(blasterLevel);
              openDrawer!("repair");
            }}
          />
        </div>

        <div className="store-card__body-main-block-cuttedBtnWrapper">
          <CuttedButton
            size="small"
            text={t("shopModal.storeTab.upgrade")}
            callback={() => {
              selectGun(blasterLevel);
              openDrawer!("upgrade");
            }}
          />
        </div>
      </div>
    </div>
  );
}
