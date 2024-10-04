/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SendTransactionRequest, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BlastersData,
  CharactersData,
  useUserData,
} from "../../../UserDataService.tsx";
import { useDrawer } from "../../../context/DrawerContext.tsx";
import { useModal } from "../../../context/ModalContext.tsx";
import { PROJECT_CONTRACT_ADDRESS } from "../../../main.tsx";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import {
  ModelTypeNew,
  PillType,
  StoreWeaponType,
  WeaponType,
} from "../../../ui/SlidingPills/types";
import { PlayerCard } from "./components/PlayerCard";
import { StoreCardWeapon } from "./components/StoreCard";
import { WeaponCard } from "./components/WeaponCard";
import "./styles/shop.css";

export function Shop() {
  const { t } = useTranslation();

  const pills: PillType[] = [
    {
      label: t("shopModal.playerTab.title"),
      value: "PLAYER",
      component: <Player />,
    },
    {
      label: t("shopModal.weaponTab.title"),
      value: "WEAPON",
      component: <Weapon />,
    },
    {
      label: t("shopModal.storeTab.title"),
      value: "STORE",
      component: <Store />,
    },
  ];

  const { activePillProp } = useModal();

  const [activePill, setActivePill] = useState(pills[activePillProp!]);

  useEffect(() => {
    setActivePill(pills[activePillProp!]);
  }, [activePillProp]);

  return (
    <div className="shop">
      <div className="shop__pillsContainer">
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

export function Player() {
  const { characters, jwt } = useUserData();
  const { openDrawer } = useDrawer();
  const [tonConnectUI] = useTonConnectUI();
  const { t } = useTranslation();

  /*const initialCharacters: ModelType[] = [
    {
      title: "-unique rebel pilot-",
      imgSrc: model1Img,
      modelYield: "200%",
      worth: characterPrices[0].toString() + " TON",
      strength: "5",
      strengthToHeal: "2",
      reloadSpeedup: "5",
      reloadSpeedupToHeal: "4",
      charge: "500",
      chargeToHeal: "500",
      health: "3000",
      price: "1234.5678",
      callback: () => openDrawer!("heal"),
    },
    {
      title: "Stormtrooper",
      imgSrc: model2Img,
      modelYield: "300%",
      worth: characterPrices[1].toString() + " TON",
      strength: "5",
      strengthToHeal: "2",
      reloadSpeedup: "5",
      reloadSpeedupToHeal: "4",
      charge: "500",
      chargeToHeal: "500",
      health: "3000",
      price: "1234.5678",
      callback: () => openDrawer!("heal"),
    },
  ];*/

  /* TODO: NEW MOCK DATA FOR MODEL (base on new figma) */
  const mockPlayerCards: ModelTypeNew[] = [
    {
      title: CharactersData[1].name,
      strength: CharactersData[1].damage,
      reloadSpeed: CharactersData[1].charge_step,
      health: CharactersData[1].price * 2000,
      price: CharactersData[1].price,
      imgSrc: CharactersData[1].image,
      callback: () => handleCharacterBuyClick(2),
    },
    {
      title: CharactersData[2].name,
      strength: CharactersData[2].damage,
      reloadSpeed: CharactersData[2].charge_step,
      health: CharactersData[2].price * 2000,
      price: CharactersData[2].price,
      imgSrc: CharactersData[2].image,
      callback: () => handleCharacterBuyClick(3),
    },
    {
      title: CharactersData[3].name,
      strength: CharactersData[3].damage,
      reloadSpeed: CharactersData[3].charge_step,
      health: CharactersData[3].price * 2000,
      price: CharactersData[3].price,
      imgSrc: CharactersData[3].image,
      callback: () => handleCharacterBuyClick(4),
    },
    {
      title: CharactersData[4].name,
      strength: CharactersData[4].damage,
      reloadSpeed: CharactersData[4].charge_step,
      health: CharactersData[4].price * 2000,
      price: CharactersData[4].price,
      imgSrc: CharactersData[4].image,
      callback: () => handleCharacterBuyClick(5),
    },
  ];

  const [models, setModels] = useState<ModelTypeNew[]>(mockPlayerCards);

  useEffect(() => {
    const has1 = characters.some((c) => c.type === 2);
    const has2 = characters.some((c) => c.type === 3);
    const has3 = characters.some((c) => c.type === 4);
    const has4 = characters.some((c) => c.type === 5);

    const updatedWeapons = mockPlayerCards.filter((model) => {
      if (model.title === CharactersData[1].name && has1) {
        return false;
      }
      if (model.title === CharactersData[2].name && has2) {
        return false;
      }
      if (model.title === CharactersData[3].name && has3) {
        return false;
      }
      if (model.title === CharactersData[4].name && has4) {
        return false;
      }

      return true;
    });

    setModels(updatedWeapons);
  }, [characters]);

  const handleCharacterBuyClick = async (i: number) => {
    if (jwt == null || jwt === "" || !tonConnectUI.connected) {
      openDrawer!("connectWallet");
    } else {
      const fillTx: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: PROJECT_CONTRACT_ADDRESS,
            amount: (
              CharactersData[i - 1].price * 1000000000 +
              50000000
            ).toString(),
            payload: CharactersData[i - 1].payload,
          },
        ],
      };
      try {
        await tonConnectUI.sendTransaction(fillTx);
        openDrawer!("resolved", "bottom", t("shopModal.transactionSent"));
      } catch (e) {
        openDrawer!("rejected", "bottom", t("shopModal.transactionDenied"));
      }
    }
  };

  return (
    <div className="player">
      {models.map((card) => {
        return (
          <PlayerCard
            title={card.title}
            strength={card.strength}
            reloadSpeed={card.reloadSpeed}
            health={card.health}
            price={card.price}
            imgSrc={card.imgSrc}
            callback={card.callback}
          />
        );
      })}
    </div>
  );
}
export function Weapon() {
  const { blasters, jwt } = useUserData();
  const { openDrawer } = useDrawer();
  const [tonConnectUI] = useTonConnectUI();
  const { t } = useTranslation();

  const initialWeapons: WeaponType[] = [
    {
      title: BlastersData[1].name,
      imgSrc: BlastersData[1].image,
      additionalIncome: (BlastersData[1].price * 1.5).toString(),
      charge: "1000",
      chargeSpeed: "1.5%",
      rateOfFire: "2",
      damage: "3",
      durability: "100000",
      worth: BlastersData[1].price.toString() + " TON",
      weaponYield: "150%",
      level: BlastersData[1].level.toString(),
      rarity: BlastersData[1].rarity,
      callback: () => handleWeaponBuyClick(2),
    },
    {
      title: BlastersData[2].name,
      imgSrc: BlastersData[2].image,
      additionalIncome: (BlastersData[2].price * 1.5).toString(),
      charge: "2000",
      damage: "8",
      rateOfFire: "3.3",
      durability: "150000",
      chargeSpeed: "2.2%",
      worth: BlastersData[2].price.toString() + " TON",
      weaponYield: "150%",
      level: BlastersData[2].level.toString(),
      rarity: BlastersData[2].rarity,
      callback: () => handleWeaponBuyClick(3),
    },
  ];

  const [weapons, setWeapons] = useState<WeaponType[]>(initialWeapons);

  const handleWeaponBuyClick = async (i: number) => {
    if (jwt == null || jwt === "" || !tonConnectUI.connected) {
      openDrawer!("connectWallet");
    } else {
      const fillTx: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: PROJECT_CONTRACT_ADDRESS,
            amount: (
              BlastersData[i - 1].price * 1000000000 +
              50000000
            ).toString(),
            payload: BlastersData[i - 1].payload,
          },
        ],
      };
      try {
        await tonConnectUI.sendTransaction(fillTx);
        openDrawer!("resolved", "bottom", t("shopModal.transactionSent"));
      } catch (e) {
        openDrawer!("rejected", "bottom", t("shopModal.transactionDenied"));
      }
    }
  };

  useEffect(() => {
    const hasLevel2 = blasters.some((blaster) => blaster.level === 2);
    const hasLevel3 = blasters.some((blaster) => blaster.level === 3);

    const updatedWeapons = weapons.filter((weapon) => {
      if (weapon.title === BlastersData[1].name && hasLevel2) {
        return false;
      }
      if (weapon.title === BlastersData[2].name && hasLevel3) {
        return false;
      }
      return true;
    });

    setWeapons(updatedWeapons);
  }, [blasters]);

  return (
    <div className="weapon">
      {weapons.map((weapon) => {
        return (
          <WeaponCard
            title={weapon.title}
            additionalIncome={weapon.additionalIncome}
            charge={weapon.charge}
            durability={weapon.durability}
            imgSrc={weapon.imgSrc}
            damage={weapon.damage}
            rateOfFire={weapon.rateOfFire}
            chargeSpeed={weapon.chargeSpeed}
            worth={weapon.worth}
            weaponYield={weapon.weaponYield}
            callback={weapon.callback}
            level={weapon.level}
            rarity={weapon.rarity}
          />
        );
      })}
    </div>
  );
}

export function Store() {
  const { blasters, prices, userMetrics } = useUserData();
  const [weapons, setWeapons] = useState<StoreWeaponType[]>([]);
  const weaponRates = [1.25, 2, 3.3];
  /* NEW MOCK DATA (based on new figma)
  const mockStoreWeapons: StoreWeaponType[] = [
    {
      title: "super blaster",
      rarity: "common",
      level: 1,
      needRestoration: false,
      additionalIncomeCurrent: 133,
      additionalIncomeMax: 150,
      damage: 478,
      charge: 500,
      reload: 1,
      rateOfFire: 1,
      durabilityCurrent: 1851,
      durabilityMax: 2000,
      imgSrc: weapon1Img,
      blasterLevel: 1,
    },
    {
      title: "super blaster",
      rarity: "rare",
      level: 3,
      needRestoration: true,
      additionalIncomeCurrent: 133,
      additionalIncomeMax: 150,
      damage: 478,
      charge: 500,
      reload: 1,
      rateOfFire: 1,
      durabilityCurrent: 1851,
      durabilityMax: 2000,
      imgSrc: weapon1Img,
      blasterLevel: 2,
    },
  ];*/

  useEffect(() => {
    const newWeapons = blasters.map((blaster) => {
      const level =
        1 +
        blaster.charge_level +
        blaster.damage_level +
        blaster.max_charge_level;

      const earningsPercentage =
        (userMetrics.blaster_earned / userMetrics.blaster_earn_required) * 100;
      return {
        title: BlastersData[blaster.level - 1].name,
        rarity: BlastersData[blaster.level - 1].rarity,
        level: level,
        needRestoration: blaster.usage <= 0,
        additionalIncomeCurrent:
          blaster.level == 1
            ? 0
            : (BlastersData[blaster.level - 1].price *
                1.5 *
                earningsPercentage) /
              100,
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
      {weapons.map((weapon) => {
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
    </div>
  );
}
