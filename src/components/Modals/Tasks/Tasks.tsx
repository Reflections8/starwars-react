import { useTranslation } from "react-i18next";
import "./styles/tasks.css";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { useState } from "react";
import { PillType } from "../../../ui/SlidingPills/types";
import { GameTasks } from "./components/GameTasks";
import { SocialTasks } from "./components/SocialTasks";

export function Tasks() {
  const { t } = useTranslation();

  const pills: PillType[] = [
    {
      label: t("questsModal.gameTab.title"),
      value: "GAME",
      component: <GameTasks />,
    },
    {
      label: t("questsModal.socialTab.title"),
      value: "SOCIAL",
      component: <SocialTasks />,
    },
  ];
  const [activePill, setActivePill] = useState(pills[0]);

  return (
    <div className="tasks">
      <div className="tasks__pills">
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
