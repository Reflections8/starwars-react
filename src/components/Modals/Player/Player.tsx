import { useState } from "react";
import { StoreCardModel } from "../Shop/components/StoreCard";
import "./styles/Player.css";
import { StoreModelType } from "../../../ui/SlidingPills/types";
import model1Img from "../Shop/img/player/model1.png";
import model2Img from "../Shop/img/player/model2.png";

export function Player() {
  /* NEW MOCK DATA (based on new figma)*/
  const mockStoreModels: StoreModelType[] = [
    {
      title: "-unique rebel pilot-",
      needRestoration: false,
      combatPerfomanceReduction: null,
      strength: 5,
      strengthUpgrade: 2,
      reload: 5,
      reloadUpgrade: 4,
      charge: 500,
      chargeUpgrade: 500,
      healthCurrent: 1851,
      healthMax: 2000,
      imgSrc: model1Img,
    },
    {
      title: "-unique rebel pilot-",
      needRestoration: true,
      combatPerfomanceReduction: -90,
      strength: 5,
      strengthUpgrade: 2,
      reload: 5,
      reloadUpgrade: 4,
      charge: 500,
      chargeUpgrade: 500,
      healthCurrent: 1851,
      healthMax: 2000,
      imgSrc: model2Img,
    },
  ];

  const [storeModels] = useState(mockStoreModels);
  return (
    <div className="playerModal">
      <div className="modal__scrollContainer">
        {storeModels.map((model) => {
          return (
            <StoreCardModel
              title={model.title}
              needRestoration={model.needRestoration}
              combatPerfomanceReduction={model.combatPerfomanceReduction}
              strength={model.strength}
              strengthUpgrade={model.strengthUpgrade}
              reload={model.reload}
              reloadUpgrade={model.reloadUpgrade}
              charge={model.charge}
              chargeUpgrade={model.chargeUpgrade}
              healthCurrent={model.healthCurrent}
              healthMax={model.healthMax}
              imgSrc={model.imgSrc}
            />
          );
        })}
      </div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
