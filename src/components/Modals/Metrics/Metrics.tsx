import { useEffect, useState } from "react";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import "./styles/metrics.css";
import financesIcon1 from "./img/finances/1.svg";
import financesIcon2 from "./img/finances/2.svg";
import financesIcon3 from "./img/finances/3.svg";
import modelIcon3 from "./img/models/heart.svg";
import {
  Character,
  CharactersData,
  useUserData,
} from "../../../UserDataService.tsx";

export function Metrics() {
  const pills: PillType[] = [
    {
      label: "Финансы",
      value: "FINANCES",
      component: <Finances />,
    },
    {
      label: "Персонажи",
      value: "MODELS",
      component: <Models />,
    },
  ];
  const [activePill, setActivePill] = useState(pills[0]);

  return (
    <div className="metrics">
      <div className="metrics__pills">
        <SlidingPills
          pills={pills}
          activePill={activePill}
          setActivePill={setActivePill}
        />
      </div>

      <div className="modal__scrollContainer">{activePill.component}</div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}

export function Finances() {
  const { userMetrics, characters } = useUserData();
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    if (!characters || characters.length == 0) return;

    let earned = userMetrics.total_earned_tokens;
    characters.forEach((c) => {
      earned += c.total_earned_tokens;
    });

    setTotalEarned(earned);
  }, [characters, userMetrics]);

  return (
    <div className="finances">
      <div className="finances__item">
        <div className="finances__item-info">
          <div className="finances__item-info-key">депозитов:</div>
          <div className="finances__item-info-value">
            {userMetrics.total_deposited} ton
          </div>
        </div>
        <img src={financesIcon1} alt="icon" className="finances__item-icon" />
      </div>

      <div className="finances__item">
        <div className="finances__item-info">
          <div className="finances__item-info-key">заработано:</div>
          <div className="finances__item-info-value">{totalEarned} akron</div>
        </div>
        <img src={financesIcon2} alt="icon" className="finances__item-icon" />
      </div>

      <div className="finances__item finances__item--Complex">
        <div className="finances__item-top">
          <div className="finances__item-info">
            <div className="finances__item-info-key">Выиграно::</div>
          </div>
          <img src={financesIcon3} alt="icon" className="finances__item-icon" />
        </div>

        <div className="finances__item-bottom">
          <div className="finances__item-bottom-row">
            <div className="finances__item-bottom-row-key">Кредитов</div>
            <div className="finances__item-bottom-row-value">0</div>
          </div>
          <div className="finances__item-bottom-row">
            <div className="finances__item-bottom-row-key">akron</div>
            <div className="finances__item-bottom-row-value">0</div>
          </div>

          <div className="finances__item-bottom-row">
            <div className="finances__item-bottom-row-key">ton</div>
            <div className="finances__item-bottom-row-value">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

type MockModelsType = {
  title: string;
  deposits: number;
  earned: string;
  healthCurrent: number;
  healthMax: number;
  imgSrc: string;
};

export function Models() {
  const [models, setModels] = useState<MockModelsType[]>([]);

  const { characters } = useUserData();
  useEffect(() => {
    const createModel = (character: Character): MockModelsType => {
      const health = Math.round(
        2000 - (character.earned / character.earn_required) * 2000
      );
      return {
        title: "-" + CharactersData[character.type - 1].name + "-",
        imgSrc: CharactersData[character.type - 1].image,
        healthCurrent: health <= 0 ? 0 : health,
        healthMax: 2000,
        deposits: character.total_deposited,
        earned: character.total_earned_tokens.toString(),
      };
    };

    const newModels = characters
      .map((character) => {
        return createModel(character);
      })
      .filter((model) => model !== null);

    setModels(newModels);
  }, [characters]);

  return (
    <div className="models">
      {models.map((item) => {
        return (
          <div className="models__item">
            <div className="models__item-title">{item.title}</div>
            <div className="models__item-body">
              <div className="models__item-body-list">
                <div className="models__item-body-list-item">
                  <div className="models__item-body-list-item-info">
                    <div className="models__item-body-list-item-info-key">
                      депозитов:
                    </div>
                    <div className="models__item-body-list-item-info-value">
                      {item.deposits} TON
                    </div>
                  </div>
                  <img
                    src={financesIcon1}
                    alt="icon"
                    className="models__item-body-list-item-icon"
                  />
                </div>

                <div className="models__item-body-list-item">
                  <div className="models__item-body-list-item-info">
                    <div className="models__item-body-list-item-info-key">
                      заработано:
                    </div>
                    <div className="models__item-body-list-item-info-value">
                      {item.earned} AKRON
                    </div>
                  </div>
                  <img
                    src={financesIcon2}
                    alt="icon"
                    className="models__item-body-list-item-icon"
                  />
                </div>

                <div className="models__item-body-list-item">
                  <div className="models__item-body-list-item-info">
                    <div className="models__item-body-list-item-info-key">
                      здоровье:
                    </div>
                    <div className="models__item-body-list-item-info-value">
                      <span className="red">{item.healthCurrent}</span>
                      <span className="white">/{item.healthMax}</span>
                    </div>
                  </div>
                  <img
                    src={modelIcon3}
                    alt="icon"
                    className="models__item-body-list-item-icon"
                  />
                </div>
              </div>
              <img
                src={item.imgSrc}
                alt="model"
                className="models__item-body-img"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
