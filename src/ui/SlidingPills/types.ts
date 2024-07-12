import { ReactNode } from "react";

export type PillType = {
  label: string;
  value: string;
  component?: ReactNode;
};

export type ModelType = {
  title: string;
  imgSrc: string;
  modelYield: string;
  strength: string;
  strengthToHeal: string;
  reloadSpeedup: string;
  reloadSpeedupToHeal: string;
  charge: string;
  chargeToHeal: string;
  health: string;
  price: string;
  worth: string;
  callback: () => void;
};

export type WeaponType = {
  title: string;
  imgSrc: string;
  additionalIncome: string;
  charge: string;
  damage: string;
  durability: string;
  weaponYield: string;
  rateOfFire: string;
  chargeSpeed: string;
  worth: string;
  level: string;
  rarity: string;
  callback: () => void;
};

export type StoreType = {
  rarity: string;
  title: string;
  imgSrc: string;
  strength: string;
  maxStrength: string;
  level: string;
  gunLevel: number;
};
