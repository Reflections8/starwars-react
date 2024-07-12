import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import { ModelType } from "../../../../ui/SlidingPills/types";

type PlayerCardProps = ModelType;

export function PlayerCard({
  title,
  imgSrc,
  callback,
  strength,
  strengthToHeal,
  reloadSpeedup,
  reloadSpeedupToHeal,
  charge,
  chargeToHeal,
  health,
}: PlayerCardProps) {
  return (
    <div className="player-card">
      <div className="player-card-title">{title}</div>
      <div className="player-card-subtitle">Боевые показатели:</div>
      <div className="player-card-main">
        <img src={imgSrc} alt="model" className="player-card-main-modelBlock" />
        <div className="player-card-main-info">
          <div className="player-card-main-info-list">
            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                сила(урон):
              </div>
              <div className="player-card-main-info-list-item-value">
                {strength} <span className="green">(+{strengthToHeal}) </span>
                ед.
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                перезарядка:
              </div>
              <div className="player-card-main-info-list-item-value">
                {reloadSpeedup}{" "}
                <span className="green">(+{reloadSpeedupToHeal})%</span>/мин
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">заряд:</div>
              <div className="player-card-main-info-list-item-value">
                {charge} <span className="green">(+{chargeToHeal})</span>
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                здоровье:
              </div>
              <div className="player-card-main-info-list-item-value">
                <span className="red">{health}</span>{" "}
                <span className="blue">\3000</span>
              </div>
            </div>

            <div className="player-card-main-info-btnWrapper">
              <CuttedButton
                size="small"
                text={"Исцелить"}
                callback={callback}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
