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

export type StoreModelType = {
  title: string;
  needRestoration: boolean;
  combatPerfomanceReduction: null | number;
  strength: number;
  strengthUpgrade: number;
  reload: number;
  reloadUpgrade: number;
  charge: number;
  chargeUpgrade: number;
  healthCurrent: number;
  healthMax: number;
  imgSrc: string;
  type: number;
};

export type StoreWeaponType = {
  title: string;
  rarity: string;
  level: number;
  blasterLevel: number;
  needRestoration: boolean;
  additionalIncomeCurrent: number;
  additionalIncomeMax: number;
  damage: number;
  charge: number;
  reload: number;
  rateOfFire: number;
  durabilityCurrent: number;
  durabilityMax: number;
  imgSrc: string;
};

export type ModelTypeNew = {
  title: string;
  strength: number;
  reloadSpeed: number;
  health: number;
  price: number;
  imgSrc: string;
  callback: () => void;
};
