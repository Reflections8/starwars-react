import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import arrowImg from "../img/arrow.svg";

type TaskType = {
  taskKey: string;
  taskCompleted: boolean;
  headerTitle: string;
  headerIcon: string;
  contentTitle?: string;
  contentLink?: string;
  hasProgressBar: boolean;
  taskCurrentProgress: string | number | null;
  taskMaxProgress: string | number | null;
  taskReward: string | number;
  wasSent: boolean;
  actionCallback: (taskReward: string | number) => void;
  additionalCallback: (value: string | number) => void;
};

export function TaskMakePost({
  taskKey,
  taskCompleted,
  headerTitle,
  headerIcon,
  contentTitle,
  taskReward,
  wasSent,
  actionCallback,
  additionalCallback,
}: TaskType) {
  const { t } = useTranslation();

  const [link, setLink] = useState("");

  return (
    <>
      {/* TASK */}
      <div className={`accordion__task ${taskCompleted ? "completed" : null}`}>
        {/* HEADER */}
        <input id={taskKey} type="checkbox" className="accordion__task-input" />
        <label htmlFor={taskKey}>
          <div className="accordion__task-header">
            <div className="accordion__task-header-content">
              <img
                src={headerIcon}
                alt="earn-credits"
                className="accordion__task-header-content-icon"
              />
              <div className="accordion__task-header-content-title">
                {headerTitle}
              </div>
            </div>
            <img
              src={arrowImg}
              alt="arrow"
              className="accordion__task-header-arrow"
            />
          </div>
        </label>
        {/* BODY */}
        <div className="accordion__task-contentWrapper">
          <div className="accordion__task-content">
            <div className="accordion__task-content-title makePost">
              {contentTitle} <span style={{ color: "#1BDD15" }}>#AKRONIX</span>
            </div>

            <div className="accordion__task-content-inputWrapper">
              <input
                type="text"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className="accordion__task-content-input"
              />
            </div>

            <CuttedButton
              className={`accordion__task-content-main-button makePost ${
                !link || wasSent ? "halfTransparent" : null
              }`}
              size="small"
              text={
                wasSent
                  ? t("questsModal.socialTab.alreadySent")
                  : t("questsModal.socialTab.sendToModeration")
              }
              callback={(e) => {
                e.preventDefault();
                additionalCallback(link);
              }}
            />

            <div className="accordion__task-content-divider" />
            <div className="accordion__task-content-main">
              <div className="accordion__task-content-main-reward">
                <div className="accordion__task-content-main-reward-key">
                  {t("questsModal.reward")}
                </div>
                <div className="accordion__task-content-main-reward-value">
                  {taskReward} {t("questsModal.cred")}
                </div>
              </div>
              <div className="accordion__task-content-main-buttonWrapper">
                <CuttedButton
                  className={`accordion__task-content-main-button ${
                    !taskCompleted ? "halfTransparent" : null
                  }`}
                  size="small"
                  text={t("questsModal.get")}
                  callback={(e) => {
                    e.preventDefault();
                    actionCallback(taskReward);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
