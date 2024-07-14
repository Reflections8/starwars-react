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
  StoreType,
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
  const characterPrices = [1, 2, 3];
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
      strength: 1234,
      reloadSpeed: 478,
      health: 3000,
      price: characterPrices[0],
      imgSrc: model1Img,
      callback: () => handleCharacterBuyClick(1),
    },
    {
      title: "Stormtrooper",
      strength: 2,
      reloadSpeed: 132,
      health: 333,
      price: characterPrices[1],
      imgSrc: model2Img,
      callback: () => handleCharacterBuyClick(2),
    },
    {
      title: "Driver",
      strength: 2,
      reloadSpeed: 132,
      health: 333,
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

  const blasterPrices = [1, 2];

  const initialWeapons: WeaponType[] = [
    {
      title: "Blaster 2 Lvl",
      imgSrc: weapon1Img,
      additionalIncome: "133",
      charge: "500",
      chargeSpeed: "1.5%",
      rateOfFire: "2",
      damage: "3",
      durability: "1830",
      worth: blasterPrices[0].toString() + " TON",
      weaponYield: "150%",
      level: "1",
      rarity: "common",
      callback: async () => {
        if (jwt == null || jwt === "" || !tonConnectUI.connected) {
          openDrawer!("connectWallet");
        } else {
          const fillTx: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: PROJECT_CONTRACT_ADDRESS,
                amount: (blasterPrices[0] * 1000000000 + 50000000).toString(),
                payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAAqwzHw4=",
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
            openDrawer!(
              "rejected",
              "bottom",
              "Отправка транзакции была отклонена"
            );
          }
        }
      },
    },
    {
      title: "Blaster 3 Lvl",
      imgSrc: weapon1Img,
      additionalIncome: "133",
      charge: "500",
      damage: "8",
      rateOfFire: "3.3",
      durability: "1830",
      chargeSpeed: "2.2%",
      worth: blasterPrices[1].toString() + " TON",
      weaponYield: "150%",
      level: "2",
      rarity: "rare",
      callback: async () => {
        if (jwt == null || jwt === "" || !tonConnectUI.connected) {
          openDrawer!("connectWallet");
        } else {
          const fillTx: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: PROJECT_CONTRACT_ADDRESS,
                amount: (blasterPrices[1] * 1000000000 + 50000000).toString(),
                payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAA6+wdPw=",
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
            openDrawer!(
              "rejected",
              "bottom",
              "Отправка транзакции была отклонена"
            );
          }
        }
      },
    },
  ];

  const [weapons, setWeapons] = useState<WeaponType[]>(initialWeapons);

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
  const [weapons, setWeapons] = useState<StoreType[]>([]);
  console.log({ weapons });

  /* NEW MOCK DATA (based on new figma)*/
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
    },
  ];

  const [storeWeapons] = useState(mockStoreWeapons);

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
        rarity,
        title: "super blaster",
        imgSrc: storeImg,
        strength: blaster.usage.toString(),
        maxStrength: blaster.max_usage.toString(),
        level: level.toString(),
        gunLevel: blaster.level,
      };
    });

    setWeapons(newWeapons);
  }, [blasters, prices.third_blaster_repair, prices.second_blaster_repair]);

  return (
    <div className="store">
      {storeWeapons.map((weapon) => {
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
          />
        );
      })}
    </div>
  );
}
