import { TaskType } from "../types";
import { TaskContent } from "./TaskContent";
import { TaskHeader } from "./TaskHeader";

export function GameTasks({
  tasks,
  loadTasks,
}: {
  tasks: TaskType[];
  loadTasks: () => void;
}) {
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
