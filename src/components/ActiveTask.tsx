import { useEffect, useRef, useState } from 'react';
import {
  PauseIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useTasks } from '@/context/TaskContext';
import { parseProgress } from '@/utils/time.utils';

const ActiveTask = () => {
  const [isHovered, setIsHovered] = useState(false);

  const { activeTask, getTaskById, updateTask, setActiveTask } = useTasks();
  const [overtime, setOvertime] = useState(false);
  const [ isPaused, setIsPaused ] = useState(false);
  
  const intervalRef = useRef(null);
  
  const currentTask = getTaskById(activeTask);

  const title = currentTask?.task_name;
  const estimate = currentTask?.estimate ?? 60;
  
  const [taskTimer, setTaskTimer] = useState(currentTask?.progress);

  const taskTimerRef = useRef(0);

  const previousTaskId = useRef<number | null>(null);

  useEffect(() => {
    if (
      previousTaskId.current !== null &&
      previousTaskId.current !== activeTask
    ) {
      updateTask(previousTaskId.current, {
        active: false,
        progress: taskTimerRef.current,
      });
    }

    if (activeTask !== null) {
      updateTask(activeTask, {
        active: true,
      });
    }

    setTaskTimer(currentTask?.progress > 0 ? currentTask?.progress : estimate);
    setOvertime(currentTask?.progress > estimate);
    previousTaskId.current = activeTask;
  }, [activeTask]);


  useEffect(() => {
    if(!isPaused) {

      intervalRef.current = setInterval(() => {
        setTaskTimer((prev) => {
          if (prev === 0 && !overtime) {
            setOvertime(true);
            return 0;
          }
          taskTimerRef.current = prev + (overtime ? 1 : -1);
          return prev + (overtime ? 1 : -1);
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused, overtime]);

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
              {parseProgress(taskTimer)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTask;
