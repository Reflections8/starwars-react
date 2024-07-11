import { ModelType } from "../../../../ui/SlidingPills/types";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";

type PlayerCardProps = ModelType;

export function PlayerCard({
  title,
  imgSrc,
  worth,
  modelYield,
  callback,
}: PlayerCardProps) {
  return (
    <div className="player-card">
      <div className="player-card-main">
        <img src={imgSrc} alt="model" className="player-card-main-modelBlock" />
        <div className="player-card-main-info">
          <div className="player-card-main-info-title">{title}</div>

          <div className="player-card-main-info-list">
            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                доходность:
              </div>
              <div className="player-card-main-info-list-item-value">
                {modelYield}
              </div>
            </div>

            <div className="player-card-main-info-list-item">
              <div className="player-card-main-info-list-item-key">
                стоимость:
              </div>
              <div className="player-card-main-info-list-item-value">
                {worth}
              </div>
            </div>
          </div>

          <div className="player-card-main-info-btnWrapper">
            <CuttedButton text={"Купить"} callback={callback} />
          </div>
        </div>
      </div>
    </div>
  );
}
