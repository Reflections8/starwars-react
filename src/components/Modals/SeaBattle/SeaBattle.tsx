import { useEffect, useState } from "react";
import { useModal } from "../../../context/ModalContext";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import { Bet } from "./components/Bet/Bet";
import { Rivals } from "./components/Rivals/Rivals";
import { Rules } from "./components/Rules/Rules";
import { Statistic } from "./components/Statistic/Statistic";
import rulesCornerImg from "./img/rules-button-corner.svg";
import rulesImg from "./img/rules-button.svg";
import "./styles/SeaBattle.css";
import { useTranslation } from "react-i18next";
import { useBattleships } from "../../../context/BattleshipsContext";

export function SeaBattle() {
  const { t } = useTranslation();
  const pills: PillType[] = [
    {
      label: t("battleshipsModal.rivalsTab.title"),
      value: "RIVALS",
      component: <Rivals />,
    },
    {
      label: t("battleshipsModal.betTab.title"),
      value: "BET",
      component: <Bet />,
    },
    {
      label: t("battleshipsModal.statisticTab.title"),
      value: "STATISTIC",
      component: <Statistic />,
    },
  ];

  const outerPill: PillType = {
    label: t("rulesModal.title"),
    value: "RULES",
    component: <Rules />,
  };

  const { activePillProp } = useModal();
  const [activePill, setActivePill] = useState(pills?.[activePillProp!]);

  useEffect(() => {
    if (activePillProp && activePillProp < 0) {
      setActivePill(outerPill);
      return;
    }

    setActivePill(pills?.[activePillProp!]);
  }, [activePillProp]);

  useEffect(() => {}, [activePill]);

  const { createdRoom, setCreatedRoom, loadRooms } = useBattleships();

  useEffect(() => {
    if (createdRoom.name) {
      loadRooms();
      setActivePill(pills[0]);
      setCreatedRoom({ name: "" });
    }
  }, [createdRoom.name]);

  return (
    <div className="seaBattle">
      <div className="seaBattle__rulesButtonWrapper">
        <img
          src={rulesCornerImg}
          alt="rules-corner"
          className="seaBattle__rulesButtonWrapper-btn-corner--Left"
        />
        <img
          src={rulesImg}
          alt="rules"
          className="seaBattle__rulesButtonWrapper-btn"
          onClick={() => {
            setActivePill(outerPill);
          }}
        />
        <img
          src={rulesCornerImg}
          alt="rules-corner"
          className="seaBattle__rulesButtonWrapper-btn-corner--Right"
        />
      </div>
      <div className="seaBattle__pillsContainer">
        <SlidingPills
          pills={pills}
          activePill={activePill}
          setActivePill={setActivePill}
        />
      </div>

      <div className="modal__scrollContainer">{activePill?.component}</div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
