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
  worth: string;
  callback: () => void;
};

export type WeaponType = {
  title: string;
  imgSrc: string;
  damage: string;
  weaponYield: string;
  rateOfFire: string;
  chargeSpeed: string;
  worth: string;
  callback: () => void;
};

export type StoreType = {
  rarity: string;
  title: string;
  imgSrc: string;
  strength: string;
  level: string;
};
