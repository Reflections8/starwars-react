/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
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
  const weapons: WeaponType[] = [
    {
      title: "super blaster 1",
      imgSrc: weapon1Img,
      damage: "456",
      rateOfFire: "12",
      chargeSpeed: "300",
      worth: "1100 woopy",
      weaponYield: "200%",
      callback: () => console.log("WEAPON 1"),
    },
    {
      title: "super blaster 2",
      imgSrc: weapon1Img,
      damage: "456",
      rateOfFire: "12",
      chargeSpeed: "300",
      worth: "1100 woopy",
      weaponYield: "200%",
      callback: () => console.log("WEAPON 2"),
    },
  ];

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
