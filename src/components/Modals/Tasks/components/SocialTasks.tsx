import { useTranslation } from "react-i18next";
import twitterSubscribeIcon from "../img/social/x.svg";
import youtubeSubscribeIcon from "../img/social/youtube.svg";
import watchVideoIcon from "../img/social/eye.svg";
import inviteFriendIcon from "../img/social/handshake.svg";
import friendBecameWarriorIcon from "../img/social/force.svg";
import makePostIcon from "../img/social/write.svg";

import { Task } from "./Task";
import { TaskMakePost } from "./TaksMakePost";

export function SocialTasks() {
  const { t } = useTranslation();

  const tasks = [
    {
      key: "twitter-subscribe",
      completed: false,
      header: {
        title: t("questsModal.socialTab.twitterSubscribe"),
        icon: twitterSubscribeIcon,
      },
      content: {
        link: "x.com/akronix_game",
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "youtube-subscribe",
      completed: false,
      header: {
        title: t("questsModal.socialTab.youtubeSubcribe"),
        icon: youtubeSubscribeIcon,
      },
      content: {
        link: "youtu.be/akronix_game",
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "watch-video",
      completed: false,
      header: {
        title: t("questsModal.socialTab.watchVideo"),
        icon: watchVideoIcon,
      },
      content: {
        link: "telegram.com/akronix_game",
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "invite-friend",
      completed: false,
      header: {
        title: t("questsModal.socialTab.inviteFriend"),
        icon: inviteFriendIcon,
      },
      content: {
        link: "telegram.com/akronix_game",
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "friend-became-warrior",
      completed: false,
      header: {
        title: t("questsModal.socialTab.friendBecameWarrior"),
        icon: friendBecameWarriorIcon,
      },
      content: {
        title: `@samplename ${t("questsModal.socialTab.becameWarrior")}`,
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        actionCallback: handleCreditEarn,
      },
    },
    {
      key: "make-post",
      completed: false,
      header: {
        title: t("questsModal.socialTab.makePost"),
        icon: makePostIcon,
      },
      content: {
        title: `${t("questsModal.socialTab.makePostWithHashtag")}`,
        hasProgressBar: false,
        taskCurrentProgress: null,
        taskMaxProgress: null,
        taskReward: 100,
        wasSent: false,
        additionalCallback: sendForModeration,
        actionCallback: handleCreditEarn,
      },
    },
  ];

  function handleCreditEarn(amount: number | string) {
    alert(`YOU EARNED ${amount} CREDITS (TEST)`);
  }

  function sendForModeration(link: string) {
    alert(`YOU SENT FOR MODERATION: ${link}`);
  }

  return (
    <div className="accordion">
      {tasks?.map((task) => {
        if (task.key === "make-post") {
          return (
            <TaskMakePost
              taskKey={task.key}
              taskCompleted={task.completed}
              headerTitle={task.header.title}
              headerIcon={task.header.icon}
              contentTitle={task.content.title}
              taskReward={task.content.taskReward}
              actionCallback={task.content.actionCallback}
              // @ts-ignore
              wasSent={task.content.wasSent}
              // @ts-ignore
              additionalCallback={task.content.additionalCallback}
            />
          );
        }
        return (
          <Task
            taskKey={task.key}
            taskCompleted={task.completed}
            headerTitle={task.header.title}
            headerIcon={task.header.icon}
            contentTitle={task.content.title}
            contentLink={task.content.link}
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
