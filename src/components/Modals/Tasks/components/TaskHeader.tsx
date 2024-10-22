import buyNFTGunIcon from "../img/game/blaster.svg";
import earnCreditsIcon from "../img/game/credit.svg";
import destroyVaderDronesIcon from "../img/game/drone.svg";
import repairOrHealIcon from "../img/game/health.svg";
import buyNFTCharacterIcon from "../img/game/helmet.svg";
import winBattleshipCreditsIcon from "../img/game/reward.svg";
import destroyEnemyShipsIcon from "../img/game/spaceship.svg";
import upgradeGunIcon from "../img/game/upgrade.svg";
import { TaskType } from "../types";
import arrowImg from "../img/arrow.svg";
import twitterSubscribeIcon from "../img/social/x.svg";
import youtubeSubscribeIcon from "../img/social/youtube.svg";
import watchVideoIcon from "../img/social/eye.svg";
import inviteFriendIcon from "../img/social/handshake.svg";
import friendBecameWarriorIcon from "../img/social/force.svg";
import makePostIcon from "../img/social/write.svg";

export function TaskHeader({ task }: { task: TaskType }) {
  const taskIcons = {
    "1": earnCreditsIcon,
    "2": buyNFTCharacterIcon,
    "3": buyNFTGunIcon,
    "4": destroyVaderDronesIcon,
    "5": winBattleshipCreditsIcon,
    "6": destroyEnemyShipsIcon,
    "7": upgradeGunIcon,
    "8": repairOrHealIcon,
    "9": twitterSubscribeIcon,
    "10": youtubeSubscribeIcon,
    "11": watchVideoIcon,
    "12": inviteFriendIcon,
    "13": friendBecameWarriorIcon,
    "14": makePostIcon,
  };

  const language = localStorage.getItem("language") || "ru";

  return (
    <>
      {/* HEADER */}
      <input id={task.key} type="checkbox" className="accordion__task-input" />
      <label htmlFor={task.key}>
        <div className="accordion__task-header">
          <div className="accordion__task-header-content">
            <img
              src={taskIcons?.[task?.key as keyof typeof taskIcons]}
              alt=""
              className="accordion__task-header-content-icon"
            />
            <div className="accordion__task-header-content-title">
              {language === "ru" ? task.header.title_ru : task.header.title_en}
            </div>
          </div>
          <img
            src={arrowImg}
            alt="arrow"
            className="accordion__task-header-arrow"
          />
        </div>
      </label>
    </>
  );
}
