import { useDrawer } from "../../../../context/DrawerContext";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import { StoreType } from "../../../../ui/SlidingPills/types";
import { useUserData } from "../../../../UserDataService.tsx";

type StoreCardProps = StoreType;

export function StoreCard({
  rarity,
  title,
  imgSrc,
  strength,
  maxStrength,
  level,
  gunLevel,
}: StoreCardProps) {
  const { openDrawer } = useDrawer();
  const { selectGun } = useUserData();
  return (
    <div className="store-card">
      <div className="store-card__title">
        <div className="store-card__title-rarity">{rarity}</div>
        <div className="store-card__title-text">- {title}</div>
      </div>
      <div className="store-card__body">
        <img src={imgSrc} alt="model" className="store-card__body-img" />

        <div className="store-card__body-main">
          <div className="store-card__body-main-block">
            <div className="store-card__body-main-block-head">
              <div className="store-card__body-main-block-head-key">
                Прочность:
              </div>
              <div className="store-card__body-main-block-head-value">
                <div className="store-card__body-main-block-head-value-current">
                  {strength}
                </div>
                <div className="store-card__body-main-block-head-value-divider">
                  \
                </div>
                <div className="store-card__body-main-block-head-value-max">
                  {maxStrength}
                </div>
              </div>
            </div>
            <div className="store-card__body-main-block-cuttedBtnWrapper">
              <CuttedButton
                className={
                  gunLevel == 1 || parseInt(strength) == parseInt(maxStrength)
                    ? "halfTransparent"
                    : ""
                }
                text={"Починить"}
                callback={() => {
                  selectGun(gunLevel);
                  openDrawer!("repair");
                }}
              />
            </div>
          </div>

          <div className="store-card__body-main-block">
            <div className="store-card__body-main-block-head">
              <div className="store-card__body-main-block-head-key">
                Уровень:
              </div>
              <div className="store-card__body-main-block-head-value">
                <div className="store-card__body-main-block-head-value-current">
                  {level}
                </div>
                <div className="store-card__body-main-block-head-value-divider">
                  \
                </div>
                <div className="store-card__body-main-block-head-value-max">
                  10
                </div>
              </div>
            </div>
            <div className="store-card__body-main-block-cuttedBtnWrapper">
              <CuttedButton
                text={"Улучшить"}
                callback={() => {
                  selectGun(gunLevel);
                  openDrawer!("upgrade");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
