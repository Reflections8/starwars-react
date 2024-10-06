import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../context/ModalContext.tsx";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton.tsx";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills.tsx";
import {
  PillType,
  StoreModelType,
  StoreWeaponType,
} from "../../../ui/SlidingPills/types.ts";
import {
  Blaster,
  BlastersData,
  Character,
  CharactersData,
  useUserData,
} from "../../../UserDataService.tsx";
import {
  StoreCardModel,
  StoreCardWeapon,
} from "../Shop/components/StoreCard.tsx";
import "./styles/PlayerNew.css";

export function PlayerNew() {
  const { t } = useTranslation();

  const pills: PillType[] = [
    {
      label: t("playerModal.characters"),
      value: "CHARACTERS",
      component: <StoreCardCharacterWrapper />,
    },
    {
      label: t("playerModal.weapons"),
      value: "WEAPONS",
      component: <StoreCardWeaponWrapper />,
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
    </div>
  );
}

export function StoreCardWeaponWrapper() {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { blasters, prices, userMetrics } = useUserData();
  const [weapons, setWeapons] = useState<StoreWeaponType[]>([]);
  const weaponRates = [1.25, 2, 3.3];

  useEffect(() => {
    console.log("MOUNT");
    const newWeapons = blasters.map((blaster) => {
      const level =
        1 +
        blaster.charge_level +
        blaster.damage_level +
        blaster.max_charge_level;

      const earningsPercentage = userMetrics.earned / userMetrics.earn_required;

      return {
        title: BlastersData[blaster.level - 1].name,
        rarity: BlastersData[blaster.level - 1].rarity,
        level: level,
        needRestoration: blaster.usage <= 0,
        additionalIncomeCurrent:
          blaster.level == 1
            ? 0
            : BlastersData[blaster.level - 1].price * 1.5 * earningsPercentage,
        additionalIncomeMax:
          blaster.level == 1 ? 0 : BlastersData[blaster.level - 1].price * 1.5,
        damage: blaster.damage,
        charge: blaster.charge,
        max_charge: blaster.max_charge,
        reload: blaster.charge_step,
        rateOfFire: weaponRates[blaster.level - 1],
        durabilityCurrent: blaster.usage,
        durabilityMax: blaster.max_usage,
        imgSrc: BlastersData[blaster.level - 1].image,
        blasterLevel: blaster.level,
      };
    });

    setWeapons(newWeapons);
  }, [blasters, prices.third_blaster_repair, prices.second_blaster_repair]);

  return (
    <div className="store">
      {weapons?.map((weapon) => {
        return (
          <StoreCardWeapon
            title={weapon.title}
            rarity={weapon.rarity}
            level={weapon.level}
            needRestoration={weapon.needRestoration}
            additionalIncomeCurrent={weapon.additionalIncomeCurrent}
            additionalIncomeMax={weapon.additionalIncomeMax}
            damage={weapon.damage}
            charge={weapon.charge}
            max_charge={weapon.max_charge}
            reload={weapon.reload}
            rateOfFire={weapon.rateOfFire}
            durabilityCurrent={weapon.durabilityCurrent}
            durabilityMax={weapon.durabilityMax}
            imgSrc={weapon.imgSrc}
            blasterLevel={weapon.blasterLevel}
          />
        );
      })}
      {!weapons.length ? (
        <div className="playerNew__emptyWrapper">
          <div className="playerNew__emptyWrapper-text">
            {t("playerModal.noNFTText")}
          </div>
          <CuttedButton
            text={t("shopModal.title")}
            callback={(e) => {
              e.stopPropagation();
              openModal!("shop");
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function StoreCardCharacterWrapper() {
  const { characters, blasters } = useUserData();
  const { t } = useTranslation();
  const { openModal } = useModal();

  const [storeModels, setStoreModels] = useState([]);

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

    // @ts-ignore
    setStoreModels(newModels);
  }, [characters, blasters]);

  return (
    <div className="store">
      {storeModels?.map((model: StoreModelType) => {
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
            callback={(e) => {
              e.stopPropagation();
              openModal!("shop");
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
