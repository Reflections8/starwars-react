import { useEffect } from "react";
import { TaskType } from "../types";
import { TaskContent } from "./TaskContent";
import { TaskContentMakePost } from "./TaskContentMakePost";
import { TaskHeader } from "./TaskHeader";

export function SocialTasks({
  tasks,
  loadTasks,
}: {
  tasks: TaskType[];
  loadTasks: () => void;
}) {
  useEffect(() => {}, [tasks]);

  return (
    <div className="accordion">
      {tasks?.map((task) => {
        const anySubtaskCompleted = task.content.some(
          (subtask) => subtask.completed
        );
        return (
          <div
            className={`accordion__task ${
              anySubtaskCompleted ? "completed" : null
            }`}
          >
            <TaskHeader task={task} />
            {task.content?.map((subtask) => {
              if (task.key === "14") {
                return (
                  <TaskContentMakePost
                    taskKey={task.key}
                    subtask={subtask}
                    loadTasks={loadTasks}
                  />
                );
              }

              return (
                <TaskContent
                  taskKey={task.key}
                  subtask={subtask}
                  loadTasks={loadTasks}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
