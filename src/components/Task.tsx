import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useState } from 'react';
import { ArrowDownIcon, CheckCircleIcon, CheckIcon, ChevronDownIcon, DocumentTextIcon, PlayIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { useTasks } from '@/context/TaskContext';

import { Task } from '@/types/task.types';

import { formatEstimate, formatProgress } from '@/utils/time.utils';

import { useAppContext } from '@/context/AppContext';
import TaskContextMenu from './TaskContextMenu';
import EditTask from './EditTask';
import DonutProgressBar from './DonutProgressBar';
import ProgressDonut from './DonutProgressBar';

const TaskComponent = ({ order, task }: { order: number; task: Task }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: task.id,
  });

  const { state, updateState } = useAppContext();

  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [ editTaskOpen, setEditTaskOpen ] = useState(false);

  const { updateTask, setActiveTask } = useTasks();

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const completeTime = 200;

  const { task_name: title, estimate } = task;9
  const progress =
    task.progress > estimate ? task.progress : estimate - task.progress;

  const checkIsHovered = (value: boolean) => {
    setIsHovered(value);
  };

  const openEditTask = () => {
    setEditTaskOpen(true);
    checkIsHovered(false);
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => checkIsHovered(!editTaskOpen && true)}
      onMouseLeave={() => checkIsHovered(false)}
    >
      <div
        className={`min-h-[calc(60px)]  bg-gray-800 py-2 px-4 rounded-lg relative transition-all duration-${completeTime} ease-in-out ${
          isCompleting ? '-translate-y-10 opacity-0' : ''
        }`}
      >
        <div className={`flex justify-between transition-all duration-200`}>
          <div className="flex space-x-2 font-bold max-w-full justify-center items-center overflow-hidden">
            <h1 className="text-gray-400 text-sm">{order}</h1>

            {/* Icon container with animated width */}
            <div
              className={`overflow-hidden transition-all duration-100 ease-in-out z-20 ${
                isHovered ? 'w-5' : 'w-0 pointer-events-none'
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

            {/* Title with margin transition */}
            <h1 className={`text-white truncate text-base`}>{title}</h1>
          </div>
          <div
            className={`flex space-x-2 justify-end z-20 transition-opacity duration-100 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <QueueListIcon
              className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"/>

            <DocumentTextIcon
              className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={openEditTask}
            />
            <PlayIcon
              className="h-5 w-5 text-gray-400 hover:text-green-400"
              onClick={() => setActiveTask(task.id)}
            />

            <TaskContextMenu />
            <EditTask
              isOpen={editTaskOpen}
              onClick={setEditTaskOpen}
              taskId={task.id}
            />

          </div>
        </div>
        <div className={`flex justify-between transition-opacity duration-200`}>
          <p className="text-gray-400 text-sm">{formatEstimate(estimate)}</p>
          <p className="text-gray-400 text-sm">{formatProgress(progress)}</p> 
        </div>
        <hr className="w-full bg-gray-700 h-1 rounded-lg mt-2"/>
        <div className="flex justify-between items-center mt-2">
          <ProgressDonut progress={33} size={24}/>  
            <ChevronDownIcon className="h-4 w-4 text-gray-400 inline-block mr-1" />
          
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div><div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-gray-400" />
            Subtask
          </div>
          
            </div>
        <div
          className="absolute top-0 left-0 w-full h-full z-10"
          {...listeners}
          {...attributes}
        ></div>
      </div>
    </div>
  );
};

export default TaskComponent;
