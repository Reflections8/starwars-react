import { useTranslation } from "react-i18next";
import earnCreditsIcon from "../img/game/credit.svg";
import buyNFTCharacterIcon from "../img/game/helmet.svg";
import buyNFTGunIcon from "../img/game/blaster.svg";
import destroyVaderDronesIcon from "../img/game/drone.svg";
import winBattleshipCreditsIcon from "../img/game/reward.svg";
import destroyEnemyShipsIcon from "../img/game/spaceship.svg";
import upgradeGunIcon from "../img/game/upgrade.svg";
import repairOrHealIcon from "../img/game/health.svg";
import { Task } from "./Task";

export function GameTasks() {
  const { t } = useTranslation();

  const tasks = [
    {
      key: "earn-credits",
      completed: false,
      header: {
        title: t("questsModal.gameTab.earnCredits"),
        icon: earnCreditsIcon,
      },
      content: {
        title: t("questsModal.gameTab.earn1000Credits"),
        hasProgressBar: true,
        taskCurrentProgress: 257,
        taskMaxProgress: 1000,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "buy-character",
      completed: false,
      header: {
        title: t("questsModal.gameTab.buyCharacter"),
        icon: buyNFTCharacterIcon,
      },
      content: {
        title: t("questsModal.gameTab.buyNFTDroid"),
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "buy-blaster",
      completed: false,
      header: {
        title: t("questsModal.gameTab.buyGun"),
        icon: buyNFTGunIcon,
      },
      content: {
        title: t("questsModal.gameTab.buyNFTBlaster"),
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "destroy-drones",
      completed: false,
      header: {
        title: t("questsModal.gameTab.destroyVaiderDrones"),
        icon: destroyVaderDronesIcon,
      },
      content: {
        title: t("questsModal.gameTab.destroy100Drones"),
        hasProgressBar: true,
        taskCurrentProgress: 0,
        taskMaxProgress: 100,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "win-battleships-credits",
      completed: false,
      header: {
        title: t("questsModal.gameTab.winCreditsInBattleships"),
        icon: winBattleshipCreditsIcon,
      },
      content: {
        title: t("questsModal.gameTab.win1000Credits"),
        hasProgressBar: true,
        taskCurrentProgress: 0,
        taskMaxProgress: 1000,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "destroy-enemy-ships",
      completed: false,
      header: {
        title: t("questsModal.gameTab.destroyEnemyShips"),
        icon: destroyEnemyShipsIcon,
      },
      content: {
        title: t("questsModal.gameTab.singleShips"),
        hasProgressBar: true,
        taskCurrentProgress: 0,
        taskMaxProgress: 100,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "upgrade-gun-once",
      completed: false,
      header: {
        title: t("questsModal.gameTab.upgradeGunOnce"),
        icon: upgradeGunIcon,
      },
      content: {
        title: t("questsModal.gameTab.upgradeAnyGun"),
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "repair-or-heal",
      completed: false,
      header: {
        title: t("questsModal.gameTab.repairOrHeal"),
        icon: repairOrHealIcon,
      },
      content: {
        title: t("questsModal.gameTab.resotreTo100"),
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
  ];

  function handleCreditEarn(amount: number | string) {
    alert(`YOU EARNED ${amount} CREDITS (TEST)`);
  }

  return (
    <div className="accordion">
      {tasks?.map((task) => {
        return (
          <Task
            taskKey={task.key}
            taskCompleted={task.completed}
            headerTitle={task.header.title}
            headerIcon={task.header.icon}
            contentTitle={task.content.title}
            hasProgressBar={task.content.hasProgressBar}
            taskCurrentProgress={task.content.taskCurrentProgress}
            taskMaxProgress={task.content.taskMaxProgress}
            taskReward={task.content.taskReward}
            actionCallback={task.content.actionCallback}
          />
        );
      })}
    </div>
  );
}
