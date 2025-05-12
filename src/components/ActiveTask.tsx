import { useEffect, useRef, useState } from 'react';
import {
  PauseIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useTasks } from '@/context/TaskContext';
import { formatProgress } from '@/utils/time.utils';

const ActiveTask = () => {
  const [isHovered, setIsHovered] = useState(false);

  const { activeTask, getTaskById, updateTask, setActiveTask } = useTasks();
  const [ isPaused, setIsPaused ] = useState(false);
  
  const intervalRef = useRef(null);
  
  const currentTask = getTaskById(activeTask);

  const title = currentTask?.task_name;
  
  const [ overtime, setOvertime ] = useState(false);
  const [ taskTimer, setTaskTimer ] = useState(currentTask?.progress);

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
    const startingTimer = current?.progress > 0 ? current.progress : current?.estimate ?? 0;

    setTaskTimer(startingTimer);
    taskTimerRef.current = startingTimer;

    const isOvertime = current?.overtime ?? false;
    setOvertime(isOvertime);
    overtimeRef.current = isOvertime;
  }

  previousTaskId.current = activeTask;
}, [activeTask]);


 useEffect(() => {
  if (!isPaused) {
    intervalRef.current = setInterval(() => {
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

  return () => clearInterval(intervalRef.current);
}, [isPaused]);

  return (
    <div
      className="font-bold text-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="m-4 p-[2px] subtle-gradient-shift bg-gradient-to-r from-green-400 to-blue-500 rounded-lg relative">
        <div className="p-3 bg-gray-800 rounded-lg relative h-[60px]">
          {' '}
          <div
            className={`absolute top-0 left-0 w-full h-full flex justify-center items-center space-x-4 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
            
            { isPaused && <PlayIcon className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" onClick={ () => setIsPaused(!isPaused)} />}
            
            { !isPaused && <PauseIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" onClick={ () => setIsPaused(!isPaused)} />} 
            {/* <PauseIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" onClick={ () => setIsPaused(!isPaused)} /> */}
            
            
            <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" onClick={() => {
              if (currentTask) {
                updateTask(currentTask.id, {
                  completed: true,
                  active: false,
                  progress: taskTimer,
                });
                setActiveTask(null);
              }
            }} />
          </div>
          {/* Default Content (Title & Time) */}
          <div
            className={`absolute top-0 left-0 w-full h-full flex justify-between items-center px-3 transition-opacity duration-200 ${
              isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <h1 className="text-white">{title}</h1>
            <h1 className={overtime ? 'text-yellow-600' : 'text-white'}>
              {formatProgress(taskTimer)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTask;
