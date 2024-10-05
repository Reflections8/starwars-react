import { useEffect, useState } from "react";
import { StoreCardModel } from "../Shop/components/StoreCard.tsx";
import "./styles/PlayerNew.css";
import { PillType, StoreModelType } from "../../../ui/SlidingPills/types.ts";
import model1Img from "../Shop/img/player/model1.png";
import model2Img from "../Shop/img/player/model2.png";
import {
  Blaster,
  Character,
  CharactersData,
  useUserData,
} from "../../../UserDataService.tsx";
import { useTranslation } from "react-i18next";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills.tsx";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton.tsx";
import { useModal } from "../../../context/ModalContext.tsx";

export function PlayerNew() {
  const { characters, blasters } = useUserData();

  /* NEW MOCK DATA (based on new figma)*/
  const mockStoreModels: StoreModelType[] = [
    {
      title: "-DROID-",
      needRestoration: false,
      combatPerfomanceReduction: null,
      strength: 5,
      strengthUpgrade: 2,
      reload: 5,
      reloadUpgrade: -1,
      charge: 500,
      chargeUpgrade: 500,
      healthCurrent: 1851,
      healthMax: 2000,
      imgSrc: model1Img,
      type: 1,
    },
    {
      title: "-STORMTROOPER-",
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
      type: 2,
    },
    {
      title: "-DRIVER-",
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
      type: 3,
    },
  ];

  const [storeModels, setStoreModels] = useState(mockStoreModels);
  console.log({ storeModels });

  useEffect(() => {
    const calculateHighestLevelBlaster = (blasters: Blaster[]) => {
      return blasters.reduce((highest: Blaster, blaster: Blaster) => {
        if (blaster.usage > 0 && blaster.level > (highest.level || 0)) {
          return blaster;
        }
        return highest;
      });
    };

    const createModel = (
      character: Character,
      blaster: Blaster
    ): StoreModelType => {
      const needRestoration = character.earned >= character.earn_required;
      const combatPerformanceReduction = needRestoration ? -90 : null;
      const strength = Math.round(
        (CharactersData[character.type - 1].damage + blaster.damage) *
          (needRestoration ? 0.1 : 1)
      );
      const charge = Math.round(
        blaster.max_charge * (needRestoration ? 0.1 : 1)
      );
      const reload =
        (CharactersData[character.type - 1].charge_step + blaster.charge_step) *
        (needRestoration ? 0.1 : 1);

      const reloadUpgrade = !needRestoration ? blaster.charge_step : -1;
      const strengthUpgrade = !needRestoration ? blaster.damage : -1;
      const chargeUpgrade = !needRestoration ? blaster.max_charge : -1;

      const maxHealth = CharactersData[character.type - 1].price * 1000;
      const health = Math.round(
        maxHealth - (character.earned / character.earn_required) * maxHealth
      );

      return {
        title: "-" + CharactersData[character.type - 1].name + "-",
        needRestoration: needRestoration,
        combatPerfomanceReduction: combatPerformanceReduction,
        strength: strength,
        strengthUpgrade: strengthUpgrade,
        reload: reload,
        reloadUpgrade: reloadUpgrade,
        charge: charge,
        chargeUpgrade: chargeUpgrade,
        // @ts-ignore
        healthCurrent: ((health <= 0 ? 0 : health) / 1000)
          .toFixed(3)
          .toString(),
        // @ts-ignore
        healthMax: CharactersData[character.type - 1].price
          .toFixed(3)
          .toString(),
        imgSrc: CharactersData[character.type - 1].image,
        type: character.type,
      };
    };

    const newModels = characters
      .map((character) => {
        const highestLevelBlaster = calculateHighestLevelBlaster(blasters);
        return createModel(character, highestLevelBlaster);
      })
      .filter((model) => model !== null);

    setStoreModels(newModels);
  }, [characters, blasters]);

  const { t } = useTranslation();

  const pills: PillType[] = [
    {
      label: t("playerModal.characters"),
      value: "CHARACTERS",
      // TODO: убрать мок
      component: <StoreCardCharacter storeModels={mockStoreModels} />,
    },
    {
      label: t("playerModal.weapons"),
      value: "WEAPONS",
      // TODO: убрать мок
      component: <StoreCardWeapon storeModels={mockStoreModels} />,
    },
  ];

  const [activePill, setActivePill] = useState(pills[0]);

  return (
    <div className="playerModal">
      <div className="playerModal__pillsContainer">
        <SlidingPills
          pills={pills}
          activePill={activePill}
          setActivePill={setActivePill}
        />
      </div>

      <div className="modal__scrollContainer">{activePill.component}</div>
      <div className="modal__scrollContainer__bottomGradient"></div>

      {/* <div className="modal__scrollContainer">
        {storeModels.length &&
          storeModels.map((model) => {
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
                healthCurrent={
                  model.healthCurrent <= 0 ? 0 : model.healthCurrent
                }
                healthMax={model.healthMax}
                imgSrc={model.imgSrc}
                type={model.type}
              />
            );
          })}
        {!storeModels.length ? (
          <div className="bet__title">
            {t("battleshipsModal.betTab.createYourOwnDuel")}!
          </div>
        ) : null}
      </div>
      <div className="modal__scrollContainer__bottomGradient"></div> */}
    </div>
  );
}

export function StoreCardWeapon({ storeModels }: any) {
  const { t } = useTranslation();
  const { openModal } = useModal();

  return (
    <div className="store">
      {storeModels.length &&
        storeModels.map((model: any) => {
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
              healthCurrent={model.healthCurrent <= 0 ? 0 : model.healthCurrent}
              healthMax={model.healthMax}
              imgSrc={model.imgSrc}
              type={model.type}
            />
          );
        })}
      {!storeModels.length ? (
        <div className="playerNew__emptyWrapper">
          <div className="playerNew__emptyWrapper-text">
            {t("playerModal.noNFTText")}
          </div>
          <CuttedButton
            text={t("shopModal.title")}
            callback={() => {
              openModal!("shop");
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function StoreCardCharacter({ storeModels }: any) {
  const { t } = useTranslation();
  const { openModal } = useModal();
  return (
    <div className="store">
      {storeModels.length &&
        storeModels.map((model: any) => {
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
              healthCurrent={model.healthCurrent <= 0 ? 0 : model.healthCurrent}
              healthMax={model.healthMax}
              imgSrc={model.imgSrc}
              type={model.type}
            />
          );
        })}
      {!storeModels.length ? (
        <div className="playerNew__emptyWrapper">
          <div className="playerNew__emptyWrapper-text">
            {t("playerModal.noNFTText")}
          </div>
          <CuttedButton
            text={t("shopModal.title")}
            callback={() => {
              openModal!("shop");
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
