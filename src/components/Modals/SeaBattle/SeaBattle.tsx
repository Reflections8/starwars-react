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

export function SeaBattle() {
  const pills: PillType[] = [
    {
      label: "Соперники",
      value: "RIVALS",
      component: <Rivals />,
    },
    {
      label: "Ставка",
      value: "BET",
      component: <Bet />,
    },
    {
      label: "Статистика",
      value: "STATISTIC",
      component: <Statistic />,
    },
  ];

  const outerPill: PillType = {
    label: "Правила",
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
