import { useTranslation } from "react-i18next";
import arrowImg from "../img/arrow.svg";
import linkOpenIcon from "../img/link-open.svg";
import { ProgressBar } from "./ProgressBar";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";

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
  actionCallback: (taskReward: string | number) => void;
};

export function Task({
  taskKey,
  taskCompleted,
  headerTitle,
  headerIcon,
  contentTitle,
  contentLink,
  hasProgressBar,
  taskCurrentProgress,
  taskMaxProgress,
  taskReward,
  actionCallback,
}: TaskType) {
  const { t } = useTranslation();

  const progressBarConditions = !!(
    hasProgressBar &&
    taskCurrentProgress !== null &&
    taskMaxProgress !== null
  );

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
            {contentLink ? (
              <a
                href={"https://" + contentLink}
                target="_blank"
                className="accordion__task-content-link"
              >
                <span className="accordion__task-content-link-text">
                  {contentLink}
                </span>
                <img
                  src={linkOpenIcon}
                  alt="link"
                  className="accordion__task-content-link-icon"
                />
              </a>
            ) : null}
            {contentTitle ? (
              <div className="accordion__task-content-title">
                {contentTitle}
              </div>
            ) : null}
            {progressBarConditions ? (
              <ProgressBar
                className="accordion__task-content-progressBar"
                currentValue={taskCurrentProgress}
                maxValue={taskMaxProgress}
              />
            ) : (
              <div className="accordion__task-content-divider" />
            )}
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
