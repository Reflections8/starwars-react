import { useTranslation } from "react-i18next";
import "./styles/tasks.css";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { useEffect, useState } from "react";
import { PillType } from "../../../ui/SlidingPills/types";
import { GameTasks } from "./components/GameTasks";
import { SocialTasks } from "./components/SocialTasks";
import { fetchTasks } from "./services/tasks.service";
import { TaskType } from "./types";

export function Tasks() {
  const { t } = useTranslation();

  const [gameTasks, setGameTasks] = useState<TaskType[]>([]);
  const [socialTasks, setSocialTasks] = useState<TaskType[]>([]);

  async function loadTasks() {
    const res = (await fetchTasks()) as { tasks: TaskType[] };
    const filteredGameTasks =
      res?.tasks.filter((task) => task.type === "gaming") || [];
    const filteredSocialTasks =
      res?.tasks.filter((task) => task.type === "social") || [];

    setGameTasks(filteredGameTasks);
    setSocialTasks(filteredSocialTasks);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {}, [gameTasks]);

  const pills: PillType[] = [
    {
      label: t("questsModal.gameTab.title"),
      value: "GAME",
    },
    {
      label: t("questsModal.socialTab.title"),
      value: "SOCIAL",
    },
  ];
  const [activePill, setActivePill] = useState(pills[0]);

  return (
    <div className="tasks">
      <div className="tasks__pills">
        <SlidingPills
          pills={pills}
          activePill={activePill}
          setActivePill={(pill) => {
            setActivePill(pill);
          }}
        />
      </div>

      <div className="modal__scrollContainer">
        {activePill.value === "GAME" && (
          <GameTasks tasks={gameTasks} loadTasks={loadTasks} />
        )}
        {activePill.value === "SOCIAL" && (
          <SocialTasks tasks={socialTasks} loadTasks={loadTasks} />
        )}
      </div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
