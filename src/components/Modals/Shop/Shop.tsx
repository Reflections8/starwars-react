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
  const { blasters, tons, jwt, sendSocketMessage } = useUserData();
  const { closeDrawer, openDrawer } = useDrawer();

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
      callback: () => {
        if (jwt == null || jwt === "") {
          openDrawer!("connectWallet");
          console.log("ssss");
        } else if (tons < blasterPrices[0]) {
          openDrawer!(
            "rejected",
            "bottom",
            "Недостаточно TON для покупки бластера 2 уровня\nНеобходимо " +
              blasterPrices[0].toString() +
              " TON + 0.05 TON (gas fee)"
          );
        } else {
          sendSocketMessage(
            "buyBlaster:" + JSON.stringify({ item_level: 2, jwt_token: jwt })
          );
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
      callback: () => {
        if (jwt == null || jwt === "") {
          closeDrawer!();
          openDrawer!("connectWallet");
        } else if (tons < blasterPrices[1]) {
          openDrawer!(
            "rejected",
            "bottom",
            "Недостаточно TON для покупки бластера 3 уровня\nНеобходимо " +
              blasterPrices[1].toString() +
              " TON + 0.05 TON (gas fee)"
          );
        } else {
          console.log("sssaa");
          sendSocketMessage(
            "buyBlaster:" + JSON.stringify({ item_level: 3, jwt_token: jwt })
          );
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
  const weapons: StoreType[] = [
    {
      rarity: "common",
      title: "super blaster",
      imgSrc: storeImg,
      strength: "123",
      level: "2",
    },
    {
      rarity: "rare",
      title: "super blaster",
      imgSrc: storeImg,
      strength: "1",
      level: "3",
    },
  ];

  return (
    <div className="store">
      {weapons.map((weapon) => {
        return (
          <StoreCard
            rarity={weapon.rarity}
            title={weapon.title}
            imgSrc={weapon.imgSrc}
            strength={weapon.strength}
            level={weapon.level}
          />
        );
      })}
    </div>
  );
}
