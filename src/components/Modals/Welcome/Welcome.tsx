import "./styles/Welcome.css";
import exchangeBadgeBgLeft from "./img/exchange-bg-left.svg";
import exchangeBadgeBgRight from "./img/exchange-bg-right.svg";
import badgeTon from "./img/exchange-ton.svg";
import badgeAkronix from "./img/exchange-akronix.svg";
import { useEffect, useState } from "react";
import creditIcon from "./img/credit.svg";
import akronixIcon from "./img/akronix.svg";
import tonIcon from "./img/ton.svg";
import { Balance } from "../../../ui/Balance/Balance";
import { StoreCardModel } from "../Shop/components/StoreCard";
import footerBtnBg from "./img/btn.svg";
import { useModal } from "../../../context/ModalContext";
import { useTranslation } from "react-i18next";
import {
  Blaster,
  Character,
  CharactersData,
  useUserData,
} from "../../../UserDataService.tsx";
import { StoreModelType } from "../../../ui/SlidingPills/types.ts";

export function Welcome() {
  const { t } = useTranslation();
  const { tons, credits, tokens, activeCharacter, exchangeRate, blasters, setHomeState } =
    useUserData();

  const [character, setCharacter] = useState<StoreModelType | null>(null);

  useEffect(() => {
    if (!blasters || blasters.length == 0 || !activeCharacter) return;

    const calculateHighestLevelBlaster = (blasters: Blaster[]) => {
      return blasters.reduce((highest: Blaster, blaster: Blaster) => {
        if (blaster.usage > 0 && blaster.level > (highest.level || 0)) {
          return blaster;
        }
        return highest;
      });
    };

    const createModel = (
      character: Character,
      blaster: Blaster
    ): StoreModelType => {
      const needRestoration = character.earned >= character.earn_required;
      const combatPerformanceReduction = needRestoration ? -90 : null;
      const strength = Math.round(
        (CharactersData[character.type - 1].damage + blaster.damage) *
          (needRestoration ? 0.1 : 1)
      );
      const charge = Math.round(
        blaster.max_charge * (needRestoration ? 0.1 : 1)
      );
      const reload =
        (CharactersData[character.type - 1].charge_step + blaster.charge_step) *
        (needRestoration ? 0.1 : 1);

      const reloadUpgrade = !needRestoration ? blaster.charge_step : -1;
      const strengthUpgrade = !needRestoration ? blaster.damage : -1;
      const chargeUpgrade = !needRestoration ? blaster.max_charge : -1;

      return {
        title: "-" + CharactersData[character.type - 1].name + "-",
        needRestoration: needRestoration,
        combatPerfomanceReduction: combatPerformanceReduction,
        strength: strength,
        strengthUpgrade: strengthUpgrade,
        reload: reload,
        reloadUpgrade: reloadUpgrade,
        charge: charge,
        chargeUpgrade: chargeUpgrade,
        healthCurrent: character.earn_required - character.earned,
        healthMax: character.earn_required,
        imgSrc: CharactersData[character.type - 1].image,
        type: character.type,
      };
    };

    const blaster = calculateHighestLevelBlaster(blasters);
    setCharacter(createModel(activeCharacter, blaster));
  }, [activeCharacter, blasters]);

  const { closeModal } = useModal();

  return (
    <div className="welcome">
      <div className="welcome__title">{t("welcomeModal.title")}</div>
      <div className="welcome__main">
        <div className="welcome__main-balance">
          <Balance
            icon1={creditIcon}
            name1="Credit"
            value1={credits}
            icon2={akronixIcon}
            name2="Akron"
            value2={tokens}
            icon3={tonIcon}
            name3="Ton"
            value3={tons}
          />
          <div className="welcome__main-balance-text">
            {t("welcomeModal.yourBalances")}
          </div>
        </div>

        {/* EXCHANGE */}
        <div className="exchange__badge">
          <img
            src={exchangeBadgeBgLeft}
            alt="bg"
            className="exchange__badge-bg exchange__badge-bg--Left"
          />
          <img
            src={exchangeBadgeBgRight}
            alt="bg"
            className="exchange__badge-bg exchange__badge-bg--Right"
          />

          <div className="exchange__badge-item exchange__badge-item--Left">
            <div className="exchange__badge-item-name">
              <img
                src={badgeTon}
                alt="icon"
                className="exchange__badge-item-name-icon"
              />
              <div className="exchange__badge-item-name-value">credits</div>
            </div>

            <div className="exchange__badge-item-amount">1</div>
          </div>

          <div className="exchange__badge-item-equalsSign">=</div>

          <div className="exchange__badge-item exchange__badge-item--Right">
            <div className="exchange__badge-item-amount">{exchangeRate}</div>

            <div className="exchange__badge-item-name">
              <img
                src={badgeAkronix}
                alt="icon"
                className="exchange__badge-item-name-icon"
              />
              <div className="exchange__badge-item-name-value">akronix</div>
            </div>
          </div>
        </div>

        {character ? (
          <StoreCardModel
            title={character.title}
            needRestoration={character.needRestoration}
            combatPerfomanceReduction={character.combatPerfomanceReduction}
            strength={character.strength}
            strengthUpgrade={character.strengthUpgrade}
            reload={character.reload}
            reloadUpgrade={character.reloadUpgrade}
            charge={character.charge}
            chargeUpgrade={character.chargeUpgrade}
            healthCurrent={
              character.healthCurrent <= 0 ? 0 : character.healthCurrent
            }
            healthMax={character.healthMax}
            imgSrc={character.imgSrc}
            type={character.type}
          />
        ) : null}
      </div>
      <div
        className="welcome__btn"
        onClick={() => {
          setHomeState(true);
          closeModal!();
        }}
      >
        <div className="welcome__btn-content">{/* сюда текст кнопки */}</div>
        <img src={footerBtnBg} alt="bg" className="welcome__btn-bg" />
      </div>
    </div>
  );
}
