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
import { useTranslation } from "react-i18next";

export function Metrics() {
  const { t } = useTranslation();
  const pills: PillType[] = [
    {
      label: t("metricsModal.financesTab.title"),
      value: "FINANCES",
      component: <Finances />,
    },
    {
      label: t("metricsModal.modelsTab.title"),
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
  const { t } = useTranslation();

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
          <div className="finances__item-info-key">
            {t("metricsModal.financesTab.deposits")}:
          </div>
          <div className="finances__item-info-value">
            {userMetrics.total_deposited} ton
          </div>
        </div>
        <img src={financesIcon1} alt="icon" className="finances__item-icon" />
      </div>

      <div className="finances__item">
        <div className="finances__item-info">
          <div className="finances__item-info-key">
            {t("metricsModal.financesTab.earn")}:
          </div>
          <div className="finances__item-info-value">{totalEarned.toFixed(4).toString()} akron</div>
        </div>
        <img src={financesIcon2} alt="icon" className="finances__item-icon" />
      </div>

      <div className="finances__item finances__item--Complex">
        <div className="finances__item-top">
          <div className="finances__item-info">
            <div className="finances__item-info-key">
              {t("metricsModal.financesTab.win")}:
            </div>
          </div>
          <img src={financesIcon3} alt="icon" className="finances__item-icon" />
        </div>

        <div className="finances__item-bottom">
          <div className="finances__item-bottom-row">
            <div className="finances__item-bottom-row-key">
              {t("metricsModal.financesTab.credits")}
            </div>
            <div className="finances__item-bottom-row-value">
              {userMetrics.credits_won}
            </div>
          </div>
          <div className="finances__item-bottom-row">
            <div className="finances__item-bottom-row-key">akron</div>
            <div className="finances__item-bottom-row-value">
              {userMetrics.akronix_won}
            </div>
          </div>

          <div className="finances__item-bottom-row">
            <div className="finances__item-bottom-row-key">ton</div>
            <div className="finances__item-bottom-row-value">
              {userMetrics.ton_won}
            </div>
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
  const { t } = useTranslation();

  const [models, setModels] = useState<MockModelsType[]>([]);

  const { characters } = useUserData();
  useEffect(() => {
    const createModel = (character: Character): MockModelsType => {
      const maxHealth = CharactersData[character.type - 1].price * 1000;
      const health = Math.round(
        maxHealth - (character.earned / character.earn_required) * maxHealth
      );
      return {
        title: "-" + CharactersData[character.type - 1].name + "-",
        imgSrc: CharactersData[character.type - 1].image,
        // @ts-ignore
        healthCurrent: ((health <= 0 ? 0 : health) / 1000)
          .toFixed(3)
          .toString(),
        // @ts-ignore
        healthMax: CharactersData[character.type - 1].price
          .toFixed(3)
          .toString(),
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
                      {t("metricsModal.modelsTab.deposits")}:
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
                      {t("metricsModal.modelsTab.earn")}:
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
                      {t("metricsModal.modelsTab.health")}:
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
