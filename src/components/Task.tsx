import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTasks } from "@/context/TaskContext";
import {
  CheckCircleIcon,
  DocumentTextIcon,
  PlayIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import type { Task } from "@/types/task.types";

import { formatEstimate, formatProgress } from "@/utils/time.utils";

import type { Subtask } from "@/types/subtask.types";
import EditTask from "./EditTask";
import SubtasksBlock from "./SubtasksBlock";
import TaskContextMenu from "./TaskContextMenu";

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

  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState(0);
  const [subtasksList, setSubtasks] = useState<Subtask[] | null>(null);

  const { updateTask, setActiveTask, getSubtasksByTaskId } = useTasks();

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const completeTime = 200;

  const checkIsHovered = (value: boolean) => {
    setIsHovered(value);
  };

  const openEditTask = () => {
    setEditTaskOpen(true);
    checkIsHovered(false);
  };

  useEffect(() => {
    if (props.task) {
      setTask(props.task);
      setProgress(props.task.progress);

      getSubtasksByTaskId(props.task.id)
        .then((tasks) => {
          if (tasks?.length === 0) {
            setSubtasks(null);
          } else {
            setSubtasks(tasks);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  }, [props.task, getSubtasksByTaskId]);

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
                    updateTask(task.id, { completed: true, progress });
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
              onClick={() => setActiveTask(task.id)}
            />

            <TaskContextMenu
              edit={openEditTask}
              start={() => setActiveTask(task.id)}
              complete={() => {
                setIsCompleting(true);
                setTimeout(() => {
                  updateTask(task.id, { completed: true, progress });
                }, completeTime);
              }}
              deleteTask={() => props.onDelete?.()}
              onClose={() => setContextMenuOpen(false)}
              onClick={() => setContextMenuOpen(true)}
            />
          </div>
        </div>
        <div className="flex justify-between transition-opacity duration-200">
          <p className="text-gray-400 text-sm">
            {formatEstimate(task?.estimate)}
          </p>
          <p className="text-gray-400 text-sm">{formatProgress(progress)}</p>
        </div>

        <SubtasksBlock
          subtasks={subtasksList ?? []}
          parentId={task.id}
          onSubtaskChange={() => {
            getSubtasksByTaskId(task.id)
              .then((tasks) => {
                setSubtasks(tasks);
              })
              .catch((err: unknown) => {
                console.error(err);
              });
          }}
          show={subtasksList !== null}
        />

        <EditTask
          open={editTaskOpen}
          onClick={setEditTaskOpen}
          task={task}
          onChange={({ taskData, subtaskData }) => {
            if (subtaskData) {
              setSubtasks(subtaskData);
            }
            if (taskData) {
              setTask((prev) => {
                if (prev) {
                  return { ...prev, ...taskData };
                }
                return null;
              });
              props.onChange?.({ ...task, ...taskData });
              updateTask(task.id, {
                ...taskData,
                progress: task.progress,
                completed: task.completed,
                active: task.active,
              });
            }
          }}
          subtasks={subtasksList ?? []}
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
