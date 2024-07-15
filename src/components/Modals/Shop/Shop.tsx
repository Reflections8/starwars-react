/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SendTransactionRequest, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { useUserData } from "../../../UserDataService.tsx";
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
import model1Img from "./img/player/model1.png";
import model2Img from "./img/player/model2.png";
import storeImg from "./img/store/store.png";
import weapon1Img from "./img/weapon/weapon1.png";
import "./styles/shop.css";

const pills: PillType[] = [
  {
    label: "Игрок",
    value: "PLAYER",
    component: <Player />,
  },
  {
    label: "Оружие",
    value: "WEAPON",
    component: <Weapon />,
  },
  {
    label: "Склад",
    value: "STORE",
    component: <Store />,
  },
];

export function Shop() {
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
  const characterPrices = [2, 10, 30, 70];
  const characterDamages = [2, 10, 30, 70];
  const characterCharges = [0, 1, 2, 4];
  const characterPayloads = [
    "te6cckEBAQEADgAAGPbRsjsAAAABAAAAFSiQi8o=",
    "te6cckEBAQEADgAAGPbRsjsAAAABAAAAFtxj29k=",
    "te6cckEBAQEADgAAGPbRsjsAAAABAAAAF9/gsCs=",
  ];

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
      title: "Droid",
      strength: characterDamages[0],
      reloadSpeed: characterCharges[0],
      health: 2000,
      price: characterPrices[0],
      imgSrc: model1Img,
      callback: () => handleCharacterBuyClick(1),
    },
    {
      title: "Stormtrooper",
      strength: characterDamages[1],
      reloadSpeed: characterCharges[1],
      health: 2000,
      price: characterPrices[1],
      imgSrc: model2Img,
      callback: () => handleCharacterBuyClick(2),
    },
    {
      title: "Driver",
      strength: characterDamages[2],
      reloadSpeed: characterCharges[2],
      health: 2000,
      price: characterPrices[2],
      imgSrc: model2Img,
      callback: () => handleCharacterBuyClick(3),
    },
  ];

  const [models, setModels] = useState<ModelTypeNew[]>(mockPlayerCards);

  useEffect(() => {
    const has1 = characters.some((c) => c.type === 1);
    const has2 = characters.some((c) => c.type === 2);
    const has3 = characters.some((c) => c.type === 3);

    const updatedWeapons = mockPlayerCards.filter((model) => {
      if (model.title === "Droid" && has1) {
        return false;
      }
      if (model.title === "Stormtrooper" && has2) {
        return false;
      }
      if (model.title === "Driver" && has3) {
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
            amount: (characterPrices[i - 1] * 1000000000 + 50000000).toString(),
            payload: characterPayloads[i - 1],
          },
        ],
      };
      try {
        await tonConnectUI.sendTransaction(fillTx);
        openDrawer!(
          "resolved",
          "bottom",
          "Транзакция успешно отправлена.\n Ожидайте подтвержения"
        );
      } catch (e) {
        console.log(e);
        openDrawer!("rejected", "bottom", "Отправка транзакции была отклонена");
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

  const blasterPrices = [2, 10];
  const blasterPayloads = [
    "te6cckEBAQEADgAAGPbRsjsAAAABAAAAAqwzHw4=",
    "te6cckEBAQEADgAAGPbRsjsAAAABAAAAA6+wdPw=",
  ];

  const initialWeapons: WeaponType[] = [
    {
      title: "Blaster 2 Lvl",
      imgSrc: weapon1Img,
      additionalIncome: (blasterPrices[0] * 1.5).toString(),
      charge: "1000",
      chargeSpeed: "1.5%",
      rateOfFire: "2",
      damage: "3",
      durability: "100000",
      worth: blasterPrices[0].toString() + " TON",
      weaponYield: "150%",
      level: "2",
      rarity: "common",
      callback: () => handleWeaponBuyClick(1),
    },
    {
      title: "Blaster 3 Lvl",
      imgSrc: weapon1Img,
      additionalIncome: (blasterPrices[1] * 1.5).toString(),
      charge: "2000",
      damage: "8",
      rateOfFire: "3.3",
      durability: "150000",
      chargeSpeed: "2.2%",
      worth: blasterPrices[1].toString() + " TON",
      weaponYield: "150%",
      level: "3",
      rarity: "rare",
      callback: () => handleWeaponBuyClick(2),
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
            amount: (blasterPrices[i - 1] * 1000000000 + 50000000).toString(),
            payload: blasterPayloads[i - 1],
          },
        ],
      };
      try {
        await tonConnectUI.sendTransaction(fillTx);
        openDrawer!(
          "resolved",
          "bottom",
          "Транзакция успешно отправлена.\n Ожидайте подтвержения"
        );
      } catch (e) {
        console.log(e);
        openDrawer!("rejected", "bottom", "Отправка транзакции была отклонена");
      }
    }
  };

  useEffect(() => {
    const hasLevel2 = blasters.some((blaster) => blaster.level === 2);
    const hasLevel3 = blasters.some((blaster) => blaster.level === 3);

    const updatedWeapons = weapons.filter((weapon) => {
      if (weapon.title === "Blaster 2 Lvl" && hasLevel2) {
        return false;
      }
      if (weapon.title === "Blaster 3 Lvl" && hasLevel3) {
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
  const { blasters, prices } = useUserData();
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
      let rarity = "common";
      if (blaster.level >= 3) {
        rarity = "rare";
      } else if (blaster.level === 2) {
        rarity = "uncommon";
      }

      const level =
        1 +
        blaster.charge_level +
        blaster.damage_level +
        blaster.max_charge_level;
      return {
        title: "super blaster",
        rarity: rarity,
        level: level,
        needRestoration: blaster.usage <= 0,
        additionalIncomeCurrent: 133,
        additionalIncomeMax: 150,
        damage: blaster.damage,
        charge: blaster.charge,
        reload: blaster.charge_step,
        rateOfFire: weaponRates[blaster.level - 1],
        durabilityCurrent: blaster.max_usage - blaster.usage,
        durabilityMax: blaster.max_usage,
        imgSrc: storeImg,
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
