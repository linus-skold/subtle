import { useEffect, useRef, useState } from 'react';
import {
  PauseIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useTasks } from '@/context/TaskContext';
import { formatProgress } from '@/utils/time.utils';
import { Task } from '@/types/task.types';
import EditTask from './EditTask';
import { getSubtasksByParentId } from '@/utils/database.utils';

const ActiveTask = () => {
  const [isHovered, setIsHovered] = useState(false);

  const { activeTask, getTaskById, updateTask, setActiveTask } = useTasks();
  const [isPaused, setIsPaused] = useState(false);
  const [ editTaskOpen, setEditTaskOpen ] = useState(false);
  const [ subtasks, setSubtasks ] = useState([]);
  const intervalRef = useRef<number | null>(null);

  const currentTask = useRef<Task | null>(null);

  if (activeTask !== null) {
    currentTask.current = getTaskById(activeTask);
  }

  const [overtime, setOvertime] = useState(false);
  const [taskTimer, setTaskTimer] = useState(0);

  const taskTimerRef = useRef(0);
  const overtimeRef = useRef(false);

  const previousTaskId = useRef<number | null>(null);

  useEffect(() => {
    if (
      previousTaskId.current !== null &&
      previousTaskId.current !== activeTask
    ) {
      updateTask(previousTaskId.current, {
        active: false,
        overtime: overtimeRef.current,
        progress: taskTimerRef.current,
      });
    }

    if (activeTask !== null) {
      updateTask(activeTask, {
        active: true,
      });

      const current = getTaskById(activeTask);
      if (!current) return;
      const startingTimer =
        current.progress > 0 ? current.progress : current.estimate;

      setTaskTimer(startingTimer);
      taskTimerRef.current = startingTimer;

      const isOvertime = current.overtime;
      setOvertime(isOvertime);
      overtimeRef.current = isOvertime;
    }

    getSubtasksByParentId(activeTask).then((result) => {
      setSubtasks(result);
    }).catch((error: unknown) => {
      console.error('Error fetching subtasks:', error);
    });


    previousTaskId.current = activeTask;
  }, [activeTask]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTaskTimer((prev) => {
          let newTime;

          if (prev === 0 && !overtimeRef.current) {
            setOvertime(true);
            overtimeRef.current = true;
            newTime = 0;
          } else {
            newTime = prev + (overtimeRef.current ? 1 : -1);
          }

          taskTimerRef.current = newTime;
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current ?? 0);
  }, [isPaused]);

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

  return (
    <div
      className="font-bold text-xl my-2 min-h-[60px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-[2px] min-h-[60px] subtle-gradient-shift bg-gradient-to-r from-green-400 to-blue-500 rounded-lg relative">
        <div className="bg-gray-800 rounded-lg relative">
          <div
            className={`absolute top-0 left-0 w-full h-full flex justify-center items-center space-x-4 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" onClick={() => setEditTaskOpen(true)} />
            {isPaused && (
              <PlayIcon
                className={`h-5 w-5 text-gray-400 hover:text-green-500 ${isPausing ? 'animate-ping' : ''}`}
                onClick={() => setIsPausing(true)}
              />
            )}

            {!isPaused && (
              <PauseIcon
                className={`h-5 w-5 text-gray-400 hover:text-yellow-500 ${isPausing ? 'animate-ping' : ''}`}
                onClick={() => setIsPausing(true)}
              />
            )}
            {/* <PauseIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" onClick={ () => setIsPaused(!isPaused)} /> */}

            <CheckCircleIcon
              className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors"
              onClick={() => {
                if (currentTask.current?.id) {
                  updateTask(currentTask.current.id, {
                    completed: true,
                    active: false,
                    progress: taskTimer,
                  });
                  setActiveTask(null);
                }
              }}
            />
          </div>
          {/* Default Content (Title & Time) */}
          <div
            className={`w-full h-full min-h-[60px] px-3 duration-200 ${
              isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between w-full h-full min-h-[60px]">
              <h1 className="text-white">{currentTask.current?.task_name}</h1>
              <h1 className={overtime ? 'text-yellow-600' : 'text-white'}>
                {formatProgress(taskTimer)}
              </h1>
            </div>
            <div className='flex'>
            
            </div>
          </div>
        </div>
      </div>
      <EditTask 
        isOpen={editTaskOpen}
        taskId={currentTask.current?.id ?? 0}
        onClick={(v) => setEditTaskOpen(v)}
        onChange={({ subtaskData }) => {
          if (subtaskData) {
            setSubtasks(subtaskData);
          }
        }}
        subtasks={subtasks}
      />
    </div>
  );
};

export default ActiveTask;
