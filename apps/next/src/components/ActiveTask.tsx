import { formatProgress } from "../utils/time.utils";
import {
  CheckCircleIcon,
  DocumentTextIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { type Task } from "@db/schema/task.schema";
import { type Subtask } from "@db/schema/subtask.schema";

import { EditTask, SubtasksBlock } from "@/components";
import SubtaskComponent from "./SubtaskComponent";

import { useTasks } from "@/context/TaskContext";

const ActiveTask = (props: {
  task: Task;
  onComplete: (taskId: number) => void;
  onChange?: (task: Task) => void;
  onToggleFocus?: () => void;
  isFocusMode?: boolean;
}) => {
  const taskContext = useTasks();
  const { taskService } = taskContext;


  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [task, setTask] = useState<Task>();

  
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [taskTimer, setTaskTimer] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const taskTimerRef = useRef(0);
  const overtimeRef = useRef(false);

  const closeEditTask = (value: boolean) => {
    setEditTaskOpen(value);
    setIsHovered(false);
  };

  useEffect(() => {
    props.onChange?.({ ...task, progress: taskTimer });

    console.log(props.task)


    setTask(props.task);
    taskTimerRef.current = props.task.progress;
    setTaskTimer(taskTimerRef.current);
    overtimeRef.current = (props.task.progress > props.task.estimate);

    taskContext.taskService
      .getSubtasks(props.task.id)
      .then((tasks: Subtask[]) => {
        if (tasks && tasks.length > 0) {
          setSubtasks(tasks);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [props.task.id]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = window.setInterval(() => {
        taskTimerRef.current += 1;
        overtimeRef.current = taskTimerRef.current > props.task.estimate;
        setTaskTimer(taskTimerRef.current);

      }, 1000);
    }

    return () => clearInterval(intervalRef.current ?? 0);
  }, [isPaused]);

  const addSubtask = (subtask: Subtask) => {
    taskContext.taskService
      .addSubtask({ ...subtask, parentId: task.id })
      .then((newSubtask: Subtask) => {
        setSubtasks((prev) => (prev ? [...prev, newSubtask] : [newSubtask]));
      })
      .catch((err: unknown) => {
        console.error(err);
      });
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
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isPausing) {
        setIsPaused((prev) => !prev);
        setIsPausing(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [isPausing]);

  if (!task) {
    return <></>;
  }

  return (
    <div
      className={`font-bold text-xl ${props.isFocusMode ? 'w-full h-full flex items-center justify-center' : 'min-h-[60px]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={props.isFocusMode ? { WebkitAppRegion: "drag" } as React.CSSProperties : {}}
    >
      <div className={`${props.isFocusMode ? 'w-full h-full p-0' : 'p-[2px] min-h-[60px]'} subtle-gradient-shift bg-gradient-to-r from-green-400 to-blue-500 rounded-lg relative`}>
        <div className={`bg-gray-800 relative h-full ${props.isFocusMode ? 'rounded-none' : 'rounded-lg'}`}>
          {/* Button area - only covers the buttons, not the whole area */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            } px-2 py-1`}
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            {/* <div className="w-0 h-0" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}></div> */}
            {props.onToggleFocus && (
              <button
                className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors font-bold text-lg leading-none"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onToggleFocus();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title={props.isFocusMode ? "Exit focus mode" : "Enter focus mode"}
              >
                {props.isFocusMode ? "⤢" : "⛶"}
              </button>
            )}
            
            <DocumentTextIcon
              className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setEditTaskOpen(true);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
            {isPaused && (
              <PlayIcon
                className={`h-5 w-5 text-gray-400 hover:text-green-500 ${isPausing ? "animate-ping" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPausing(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              />
            )}

            {!isPaused && (
              <PauseIcon
                className={`h-5 w-5 text-gray-400 hover:text-yellow-500 ${isPausing ? "animate-ping" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPausing(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              />
            )}
            {/* <PauseIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" onClick={ () => setIsPaused(!isPaused)} /> */}

            <CheckCircleIcon
              className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                props.onComplete(task.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
          {/* Default Content (Title & Time) */}
          <div
            className={`w-full h-full px-3 duration-200 ${
              isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
            } ${props.isFocusMode ? 'min-h-full' : 'min-h-[60px]'}`}
          >
            <div className={`flex items-center justify-between w-full h-full ${props.isFocusMode ? 'min-h-full' : 'min-h-[60px]'}`}>
              <h1
                className="text-white break-words leading-tight"
                style={{
                  fontSize: props.isFocusMode ? '1rem' : `clamp(0.75rem, ${Math.min(
                    1.5,
                    20 / (task?.title?.length || 1),
                  )}rem, 1.25rem)`,
                }}
              >
                {task?.title}
              </h1>

              { overtimeRef.current && (
              <h1 className="text-yellow-600">
                {formatProgress(taskTimer - task.estimate)}
              </h1>  
              )}
              { !overtimeRef.current && (
              <h1 className="text-white">
                {formatProgress(task.estimate - taskTimer)}
              </h1>  
              )}
              

              {/* <h1 className={overtimeRef.current ? "text-yellow-600" : "text-white"}>
              <h1 className={`${overtime ? "text-yellow-600" : "text-white"} ${props.isFocusMode ? 'text-lg font-mono' : ''}`}>
                {formatProgress(taskTimer)}
              </h1> */}
            </div>
          
          </div>
        </div>
      </div>



      <EditTask
        open={editTaskOpen}
        isOpen={closeEditTask}
        task={task}
        subtasks={subtasks}
        removeSubtask={(id: number) => deleteSubtask(id)}
        addSubtask={(subtask: Subtask) => addSubtask(subtask)}
        updateSubtask={(subtask: Subtask) => updateSubtask(subtask)}
        updateTask={(updatedTask: Task) => updateTask(updatedTask)}
      />
    </div>
  );
};

export default ActiveTask;
