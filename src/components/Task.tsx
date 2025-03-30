import { z } from "zod";
import { useEffect, useState } from "react";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/16/solid";
import { TaskSubSchema, type Task } from "@/helpers/databaseHelpers";

import { CheckCircle } from "./Checkmark";

import * as dbHelper from "@/helpers/databaseHelpers";


export const TaskComponentSchema = TaskSubSchema.extend({
  level: z.number(),
  isFocused: z.boolean().optional(),
  onCheck: z.function().optional(),
  onEdit: z.function().optional(),
  onDelete: z.function().optional(),
  onClick: z.function().optional(),
  onHover: z.function().args(z.number()).optional(),
});

export type TaskComponentProps = z.infer<typeof TaskComponentSchema>; 

export const TaskComponent = (taskProps: TaskComponentProps) => {
  // if it has subtasks show an arrow and becomes an accordion

  const [task, setTask] = useState<Task>(taskProps);

  const [subtasks, setSubtasks] = useState<Task[]>(taskProps.subtasks ?? []);
  const [taskName, setTaskName] = useState(taskProps.task_name);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isCompleted, setIsCompleted] = useState(taskProps.completed ?? false);

  const [updated, setUpdated] = useState(false);

  const addSubtask = () => {
    const newTask: dbHelper.TaskInsert = {
      task_name: "Subtask",
      parent_id: taskProps.id,
    };

    dbHelper
      .addSubtask(newTask)
      .then((result) => {
        console.log(result);

        const id = result.lastInsertId;

        const subtask: Task = {
          id: id ?? -1,
          task_name: `Subtask`,
          completed: false,
          parent_id: taskProps.id,
        };
        setSubtasks((prev) => [...prev, subtask]);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!updated) return;

    const updatedTask = {
      ...task,
      task_name: taskName,
      completed: isCompleted,
    };
    setTask(updatedTask);

    dbHelper
      .editTask(updatedTask)
      .then((result) => {
        console.log(result);
      })
      .catch((err: unknown) => {
        console.error(err);
      });

    setUpdated(false);
  }, [updated]);

  const swipeAnimationClass = `
  relative overflow-hidden before:absolute before:top-0 before:left-0 before:h-full before:w-full
  before:bg-gradient-to-r before:from-transparent ${
    isCompleted ? "before:via-green-600" : "before:via-gray-600"
  } before:to-transparent
  before:transition-transform before:duration-400 before:ease-in-out
  before:content-[''] before:translate-x-[-100%]
`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    setUpdated(true);
  };

  const padding = (20 * (taskProps.level)).toString();

  return (
        <div>
          <div className="flex flex-col text-sm">
            <div
              onMouseEnter={() => {
                taskProps.onHover?.(task.id);
              }}
              className={`flex flex-row items-center pt-1 pb-1 hover:bg-gray-800 dark:hover:bg-gray-800
        ${taskProps.isFocused ? "bg-gray-800 dark" : ""}
        ${swipeAnimationClass} ${isCompleted ? "before:translate-x-full" : ""}`}
              style={{ paddingLeft: `${padding}px` }}
            >
              <div
                className={`cursor-pointer ${showSubtasks ? "rotate-90" : ""}`}
                style={{ width: "24px" }} // Fixed width to reserve space for the chevron
              >
                {subtasks.length > 0 && (
                  <ChevronRightIcon
                    className="h-4 w-4"
                    onClick={() => {
                      setShowSubtasks(!showSubtasks);
                    }}
                  />
                )}
              </div>

              <div
                className="pl-2 cursor-pointer"
                onClick={() => {
                  setIsCompleted(!isCompleted);
                  setUpdated(true);
                }}
              >
                <CheckCircle filled={isCompleted} />
              </div>

              <div
                className="cursor-pointer ml-1 hover:bg-gray-500 rounded"
                onClick={() => {
                  addSubtask();
                  setShowSubtasks(true);
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </div>

              <div className="cursor-edit pl-2 flex-1">
                <input
                  type="text"
                  value={taskName}
                  onChange={handleInputChange}
                  className="border-none focus:ring-0"
                />
              </div>
            </div>

            <hr className="h-px w-full bg-gray-200 border-0 dark:bg-gray-700" />

            {showSubtasks && (
              <div className="">
                {subtasks.map((subtask) => {
                  return (
                    <TaskComponent
                      key={subtask.id}
                      level={taskProps.level + 1}
                      task_name={subtask.task_name}
                      id={subtask.id}
                      completed={subtask.completed}
                      subtasks={subtask.subtasks}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
  );
};
