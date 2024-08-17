import { useEffect, useState } from "react";
import { useModal } from "../../../context/ModalContext";

import footerBtnBg from "./img/footerButtonBg.svg";

import damageIcon from "./img/broken-skull.svg";
import chargeIcon from "./img/battery.svg";
import reloadIcon from "./img/reload.svg";

import "./styles/CurrentStat.css";
import {
  Blaster,
  BlastersData,
  CharactersData,
  useUserData,
} from "../../../UserDataService.tsx";

export function CurrentStat() {
  const { activeCharacter, blasters } = useUserData();
  const [damage, setDamage] = useState(0);
  const [damageUpgrade, setDamageUpgrade] = useState(0);

  const [charge, setCharge] = useState(0);
  const [chargeUpgrade, setChargeUpgrade] = useState(0);

  const [reload, setReload] = useState(0);
  const [reloadUpgrade, setReloadUpgrade] = useState(0);

  const { closeModal } = useModal();

  const calculateHighestLevelBlaster = (blasters: Blaster[]) => {
    return blasters.reduce((highest: Blaster, blaster: Blaster) => {
      return blaster.level > (highest.level || 0) ? blaster : highest;
    });
  };

  useEffect(() => {
    if (!activeCharacter || !blasters || blasters.length == 0) return;

    const highestLevelBlaster = calculateHighestLevelBlaster(blasters);
    if (!highestLevelBlaster) return;

    const characterData = CharactersData[activeCharacter.type - 1];
    if (!characterData) return;

    const needHealing = activeCharacter.earned >= activeCharacter.earn_required;

    const totalDamage = Math.round(
      ((highestLevelBlaster.damage || 0) + (characterData.damage || 0)) *
        (needHealing ? 0.1 : 1)
    );

    const totalChargeStep =
      ((highestLevelBlaster.charge_step || 0) +
        (characterData.charge_step || 0)) *
      (needHealing ? 0.1 : 1);

    const charge = Math.round(
      (highestLevelBlaster.max_charge || 0) * (needHealing ? 0.1 : 1)
    );

    setDamage(totalDamage);
    setReload(totalChargeStep);
    setCharge(charge);
    setDamageUpgrade(needHealing ? 0 : highestLevelBlaster.damage);
    setReloadUpgrade(needHealing ? 0 : highestLevelBlaster.charge_step);
    setChargeUpgrade(needHealing ? 0 : highestLevelBlaster.charge);
  }, [activeCharacter, blasters]);

  return (
    <div className="currentStat">
      <div className="currentStat__title">Ваши текущие характеристики</div>
      <div className="currentStat__main">
        <div className="currentStat__main-images">
          <img
            src={
              activeCharacter
                ? CharactersData[activeCharacter.type - 1].image
                : undefined
            }
            alt=""
            className="currentStat__main-images-img"
          />
          <img
            src={
              blasters
                ? BlastersData?.[
                    calculateHighestLevelBlaster(blasters).level - 1
                  ].image
                : undefined
            }
            alt=""
            className="currentStat__main-images-img"
          />
        </div>

        <div className="currentStat__main-box">
          <div className="currentStat__main-box-title">
            характеристики комплекта:
          </div>
          <div className="currentStat__main-box-list">
            {/* ROW */}
            <div className="currentStat__main-box-list-row">
              <div className="currentStat__main-box-list-row-key">
                <img
                  src={damageIcon}
                  alt="icon"
                  className="currentStat__main-box-list-row-key-img"
                />
                <div className="currentStat__main-box-list-row-key-text">
                  Урон:
                </div>
              </div>
              <div className="currentStat__main-box-list-row-value">
                {damage}{" "}
                {damageUpgrade != 0 ? (
                  <span className="green">(+{damageUpgrade}) </span>
                ) : null}
                Ед.
              </div>
            </div>

            {/* ROW */}
            <div className="currentStat__main-box-list-row">
              <div className="currentStat__main-box-list-row-key">
                <img
                  src={chargeIcon}
                  alt="icon"
                  className="currentStat__main-box-list-row-key-img"
                />
                <div className="currentStat__main-box-list-row-key-text">
                  Заряд:
                </div>
              </div>
              <div className="currentStat__main-box-list-row-value">
                {charge}{" "}
                {chargeUpgrade != 0 ? (
                  <span className="green">(+{chargeUpgrade})</span>
                ) : null}
              </div>
            </div>

            {/* ROW */}
            <div className="currentStat__main-box-list-row">
              <div className="currentStat__main-box-list-row-key">
                <img
                  src={reloadIcon}
                  alt="icon"
                  className="currentStat__main-box-list-row-key-img"
                />
                <div className="currentStat__main-box-list-row-key-text">
                  Перезарядка:
                </div>
              </div>
              <div className="currentStat__main-box-list-row-value">
                {reload}
                {reloadUpgrade != 0 ? (
                  <span className="green">(+{reloadUpgrade})%</span>
                ) : null}
                /мин
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="currentStat__btn"
        onClick={() => {
          closeModal!();
        }}
      >
        <div className="currentStat__btn-content">OK</div>
        <img src={footerBtnBg} alt="bg" className="currentStat__btn-bg" />
      </div>
    </div>
  );
}