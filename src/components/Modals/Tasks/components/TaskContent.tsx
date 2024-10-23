import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDrawer } from "../../../../context/DrawerContext";
import { useModal } from "../../../../context/ModalContext";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import linkOpenIcon from "../img/link-open.svg";
import { fetchClaimReward, fetchTaskComplete } from "../services/tasks.service";
import { ProgressBar } from "./ProgressBar";

type TaskContentProps = {
  subtask: {
    id: number;
    title_ru: string;
    title_en: string;
    link: string;
    has_progress_bar: boolean;
    current_progress: number;
    max_progress: number;
    reward: number;
    completed: boolean;
    was_sent: boolean;
  };
  taskKey: string;
  loadTasks: () => void;
};

export function TaskContent({ subtask, taskKey, loadTasks }: TaskContentProps) {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();

  const progressBarConditions = !!(
    subtask?.has_progress_bar &&
    subtask?.current_progress !== null &&
    subtask.max_progress !== null
  );

  const [isInviteFriendTask] = useState(taskKey === "12");

  const [isModerationTask] = useState(
    taskKey === "9" || taskKey === "10" || taskKey === "11"
  );

  const language = localStorage.getItem("language") || "ru";

  async function handleRewardClaim(id: number) {
    const res = await fetchClaimReward(id);
    const result = res?.result;
    const status = res.status;

    if (!result || status !== 200) {
      openDrawer!("rejected", "bottom", t("questsModal.rejectedClaim"));
      return;
    }
    if (status === 200 && result && result.code !== 1) {
      openDrawer!("rejected", "bottom", t("questsModal.cantClaimReward"));
      return;
    }
    if (status === 200 && result && result.code === 1) {
      openDrawer!("resolved", "bottom", t("questsModal.claimRewared"));
      loadTasks();
      return;
    }
  }

  async function handleLinkCheck(id: number) {
    if (isModerationTask) {
      const resComplete = await fetchTaskComplete(id);
      const result = resComplete?.result;
      const status = resComplete.status;

      if (status !== 200 || !result) {
        openDrawer!(
          "rejected",
          "bottom",
          t("questsModal.linkCheckRequestFailed")
        );
        return;
      }
      if (status === 200 && result && result.code !== 1) {
        openDrawer!(
          "rejected",
          "bottom",
          t("questsModal.linkCheckRequestIncorrect")
        );
        return;
      }
      // Это клик по ссылке, если запрос успешный, то просто грузим задания заново, не показываем дравер.
      if (status === 200 && result && result.code === 1) {
        loadTasks();
        return;
      }
    }
  }

  return (
    <div className="accordion__task-contentWrapper">
      <div className="accordion__task-content">
        {isInviteFriendTask ? (
          <a
            onClick={(e) => {
              e.stopPropagation();
              openModal!("partners");
            }}
            className="accordion__task-content-link"
          >
            <span className="accordion__task-content-link-text">
              {t("questsModal.socialTab.inviteFriend")}
            </span>
            <img
              src={linkOpenIcon}
              alt="link"
              className="accordion__task-content-link-icon"
            />
          </a>
        ) : null}
        {!isInviteFriendTask && subtask?.link ? (
          <a
            href={subtask.link}
            target="_blank"
            className="accordion__task-content-link"
            onClick={() => {
              handleLinkCheck(subtask?.id);
            }}
          >
            <span className="accordion__task-content-link-text">
              {subtask.link}
            </span>
            <img
              src={linkOpenIcon}
              alt="link"
              className="accordion__task-content-link-icon"
            />
          </a>
        ) : null}
        {subtask?.title_ru && subtask.title_en ? (
          <div className="accordion__task-content-title">
            {language === "ru" ? subtask.title_ru : subtask.title_en}
          </div>
        ) : null}
        {progressBarConditions ? (
          <ProgressBar
            className="accordion__task-content-progressBar"
            currentValue={subtask.current_progress}
            maxValue={subtask.max_progress}
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
              {subtask?.reward} {t("questsModal.cred")}
            </div>
          </div>
          <div className="accordion__task-content-main-buttonWrapper">
            <CuttedButton
              className={`accordion__task-content-main-button ${
                !subtask?.completed ? "halfTransparent" : null
              }`}
              size="small"
              text={t("questsModal.get")}
              callback={(e) => {
                e.preventDefault();
                handleRewardClaim(subtask.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
