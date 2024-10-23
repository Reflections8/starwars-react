import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDrawer } from "../../../../context/DrawerContext";
import { CuttedButton } from "../../../../ui/CuttedButton/CuttedButton";
import { fetchTaskComplete } from "../services/tasks.service";

type TaskContentProps = {
  subtask: {
    id: number;
    title_ru: string;
    title_en: string;
    link_ru: string;
    link_en: string;
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

export function TaskContentMakePost({ subtask, loadTasks }: TaskContentProps) {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink("");
  }, [subtask]);

  const language = localStorage.getItem("language") || "ru";

  async function sendToModeration(id: number) {
    const res = await fetchTaskComplete(id);
    const result = res?.result;
    const status = res.status;
    if (!result || status !== 200) {
      openDrawer!(
        "rejected",
        "bottom",
        t("questsModal.socialTab.sendToModerationFailed")
      );
      return;
    }

    // TODO: доделай
    if (result && status === 200) {
      openDrawer!(
        "resolved",
        "bottom",
        t("questsModal.socialTab.sendToModerationSuccess")
      );
      loadTasks();
      return;
    }
  }

  return (
    <div className="accordion__task-contentWrapper">
      <div className="accordion__task-content">
        <div className="accordion__task-content-title makePost">
          {language === "ru" ? subtask?.title_ru : subtask?.title_en}{" "}
          <span style={{ color: "#1BDD15" }}>#AKRONIX</span>
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
            !link || subtask?.was_sent ? "halfTransparent" : null
          }`}
          size="small"
          text={
            subtask?.was_sent
              ? t("questsModal.socialTab.alreadySent")
              : t("questsModal.socialTab.sendToModeration")
          }
          callback={(e) => {
            e.preventDefault();
            if (link.trim().startsWith("https://")) {
              sendToModeration(subtask.id);
            } else {
              openDrawer!(
                "rejected",
                "bottom",
                t("questsModal.socialTab.linkIncorrect")
              );
            }
          }}
        />

        <div className="accordion__task-content-divider" />
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
