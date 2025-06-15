import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  CheckCircleIcon,
  DocumentTextIcon,
  PlayIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { formatEstimate, formatProgress } from "../utils/time.utils";

import type { Task } from "@db/schema/task.schema";
import type { Subtask } from "@db/schema/subtask.schema";

import { EditTask, SubtasksBlock, TaskContextMenu } from "@/components";
import { useTasks } from "@/context";
import SubtaskComponent from "./SubtaskComponent";
import { updateTask } from "@db/task.query";

const TaskComponent = (props: {
  order: number;
  task: Task;
  taskId: number;
  onChange?: (task: Task) => void;
  onDelete?: () => void;
  onComplete?: (taskId: number) => void;
  onStart?: (taskId: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: props.taskId,
  });

  const { order } = props;

  const [subtasksList, setSubtasks] = useState<Subtask[]>(null);
  const [task, setTask] = useState<Task | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const progress = useRef(0);

  const taskContext = useTasks();

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const completeTime = 200;

  const checkIsHovered = (value: boolean) => {
    setIsHovered(value);
  };

  const updateSubtask = (subtask: Subtask) => {
    taskContext.taskService
      .updateSubtask(subtask)
      .then((updated: Subtask) => {
        setSubtasks((prev) =>
          prev ? prev.map((s) => (s.id === updated.id ? updated : s)) : [],
        );
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  const deleteSubtask = (id: number) => {
    taskContext.taskService
      .deleteSubtask(id)
      .then(() => {
        setSubtasks((prev) => (prev ? prev.filter((s) => s.id !== id) : []));
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  const addSubtask = (subtask: Subtask) => {
            taskContext.taskService
              .createSubtask({ ...subtask, parentId: task.id })
              .then((newSubtask: Subtask) => {
                setSubtasks((prev) =>
                  prev ? [...prev, newSubtask] : [newSubtask],
                );
              })
              .catch((err: unknown) => {
                console.error(err);
              });
  };

  const updateTask = (updatedTask: Task) => {
    taskContext.taskService
      .updateTask(updatedTask)
      .then((updated: Task) => {
        setTask((prev) => {
          if (prev) {
            return { ...prev, ...updated };
          }
          return prev;
        });
        props.onChange?.(updated);
      }
      )
      .catch((err: unknown) => {
        console.error(err);
      }
    );
  };

  const openEditTask = () => {
    setEditTaskOpen(true);
    checkIsHovered(false);
  };

  useEffect(() => {
    setTask(props.task);
    progress.current = props.task.progress ?? 0;
    taskContext.taskService
      .getSubtasks(props.task.id)
      .then((tasks: Subtask[]) => {
        if(tasks && tasks.length > 0) {
          setSubtasks(tasks);
        } 
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [props.task.id]);

  useEffect(() => {
    if (!contextMenuOpen) {
      setIsHovered(false);
    }
  }, [contextMenuOpen]);

  if (!task) {
    return <></>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseLeave={() => checkIsHovered(contextMenuOpen)}
      onMouseEnter={() => checkIsHovered(!editTaskOpen && true)}
    >
      <div
        className={`bg-gray-800 py-2 px-4 rounded-lg relative transition-all duration-${completeTime} ease-in-out ${
          isCompleting ? "-translate-y-10 opacity-0" : ""
        }`}
      >
        <div className="flex items-center justify-between w-full font-bold transition-all duration-200 whitespace-nowrap overflow-hidden">
          {/* Left section */}
          <div className="flex items-center space-x-2 min-w-0">
            <h1 className="text-gray-400 text-sm">{order}</h1>

            <div
              className={`overflow-hidden transition-all duration-100 ease-in-out z-50 ${
                isHovered ? "w-5" : "w-0"
              }`}
            >
              <CheckCircleIcon
                className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCompleting(true);
                  setTimeout(() => {
                    console.log("Completing task:", task.id);
                    props.onComplete(task.id);
                  }, completeTime);
                }}
              />
            </div>

            <h1 className="text-white truncate text-base">{task?.title}</h1>
          </div>

          {/* Right section */}
          <div
            className={`flex items-center space-x-2 justify-end z-50 transition-opacity duration-100 ${
              isHovered ? "opacity-100" : "w-0 opacity-0"
            }`}
          >
            <QueueListIcon
              className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => {
                if (subtasksList === null) {
                  setSubtasks([]);
                }
              }}
            />

            <DocumentTextIcon
              className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={openEditTask}
            />
            <PlayIcon
              className="h-5 w-5 text-gray-400 hover:text-green-400"
              onClick={() => props.onStart?.(task.id)}
            />

            {/* <TaskContextMenu
              edit={openEditTask}
              start={() => setActiveTask(task.id)}
              complete={() => {
                setIsCompleting(true);
                setTimeout(() => {
                  // updateTask(task.id, { completed: true, progress });
                }, completeTime);
              }}
              deleteTask={() => props.onDelete?.()}
              onClose={() => setContextMenuOpen(false)}
              onClick={() => setContextMenuOpen(true)}
            /> */}
          </div>
        </div>
        <div className="flex justify-between transition-opacity duration-200">
          <p className="text-gray-400 text-sm">
            {formatEstimate(task?.estimate)}
          </p>
          <p className="text-gray-400 text-sm">{formatProgress(progress)}</p>
        </div>

        <SubtasksBlock
          show={subtasksList !== null}
          subtasks={subtasksList}
          parentId={task.id}
          onAddSubtask={(subtask: Subtask) => {
            taskContext.taskService
              .createSubtask({ ...subtask, parentId: task.id })
              .then((newSubtask: Subtask) => {
                setSubtasks((prev) =>
                  prev ? [...prev, newSubtask] : [newSubtask],
                );
              })
              .catch((err: unknown) => {
                console.error(err);
              });
          }}
        >
          {subtasksList?.map((subtask) => (
            <SubtaskComponent
              key={subtask.id}
              subtask={subtask}
              onChange={(subtask: Subtask) => updateSubtask(subtask)}
              onRemove={(id: number) => deleteSubtask(id)}
            />
          ))}
        </SubtasksBlock>

        <EditTask
          open={editTaskOpen}
          isOpen={setEditTaskOpen}
          task={task}
          subtasks={subtasksList ?? []}
          removeSubtask={(id: number) => deleteSubtask(id)}
          addSubtask={(subtask: Subtask) => addSubtask(subtask)}
          updateSubtask={(subtask: Subtask) => updateSubtask(subtask)}
          updateTask={(updatedTask: Task) => updateTask(updatedTask)}
        />

        <div
          className="absolute top-0 left-0 w-full h-full z-10"
          {...listeners}
          {...attributes}
        />
      </div>
    </div>
  );
};

export default TaskComponent;
