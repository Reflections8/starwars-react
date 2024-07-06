/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import {
  ModelType,
  PillType,
  StoreType,
  WeaponType,
} from "../../../ui/SlidingPills/types";
import { PlayerCard } from "./components/PlayerCard";
import model1Img from "./img/player/model1.png";
import model2Img from "./img/player/model2.png";
import weapon1Img from "./img/weapon/weapon1.png";
import storeImg from "./img/store/store.png";
import "./styles/shop.css";
import { WeaponCard } from "./components/WeaponCard";
import { StoreCard } from "./components/StoreCard";
import { useUserData } from "../../../UserDataService.tsx";
import { useDrawer } from "../../../context/DrawerContext.tsx";
import {SendTransactionRequest, useTonConnectUI} from "@tonconnect/ui-react";
import {PROJECT_CONTRACT_ADDRESS} from "../../../main.tsx";

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
  const [activePill, setActivePill] = useState(pills[0]);
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
  const models: ModelType[] = [
    {
      title: "namebot",
      imgSrc: model1Img,
      modelYield: "200%",
      worth: "1100 woopy",
      callback: () => console.log("BUY NAME BOT"),
    },
    {
      title: "namebot2",
      imgSrc: model2Img,
      modelYield: "300%",
      worth: "123 woopy",
      callback: () => console.log("BUY SECOND"),
    },
  ];

  return (
    <div className="player">
      {models.map((card) => {
        return (
          <PlayerCard
            title={card.title}
            imgSrc={card.imgSrc}
            modelYield={card.modelYield}
            worth={card.worth}
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
      damage: "3",
      rateOfFire: "2",
      chargeSpeed: "1.5%",
      worth: blasterPrices[0].toString() + " TON",
      weaponYield: "150%",
      callback: async () => {
        if (jwt == null || jwt === "" || !tonConnectUI.connected) {
          openDrawer!("connectWallet");
        } else {
          const fillTx: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: PROJECT_CONTRACT_ADDRESS,
                amount: ((blasterPrices[0] + 0.05) * 1000000000).toString(),
                payload: "te6cckEBAQEACgAAEPbRsjsAAAACfjGTqg==",
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
      damage: "8",
      rateOfFire: "3.3",
      chargeSpeed: "2.2%",
      worth: blasterPrices[1].toString() + " TON",
      weaponYield: "150%",
      callback: async () => {
        if (jwt == null || jwt === "" || !tonConnectUI.connected) {
          openDrawer!("connectWallet");
        } else {
          const fillTx: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: PROJECT_CONTRACT_ADDRESS,
                amount: ((blasterPrices[1] + 0.05) * 1000000000).toString(),
                payload: "te6cckEBAQEACgAAEPbRsjsAAAADfbL4WA==",
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
            imgSrc={weapon.imgSrc}
            damage={weapon.damage}
            rateOfFire={weapon.rateOfFire}
            chargeSpeed={weapon.chargeSpeed}
            worth={weapon.worth}
            weaponYield={weapon.weaponYield}
            callback={weapon.callback}
          />
        );
      })}
    </div>
  );
}

export function Store() {
  const { blasters, prices } = useUserData();
  const [weapons, setWeapons] = useState<StoreType[]>([]);

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
      {weapons.map((weapon) => {
        return (
          <StoreCard
            rarity={weapon.rarity}
            title={weapon.title}
            imgSrc={weapon.imgSrc}
            strength={weapon.strength}
            maxStrength={weapon.maxStrength}
            level={weapon.level}
            gunLevel={weapon.gunLevel}
          />
        );
      })}
    </div>
  );
}
