import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  PlayIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';
import { useTasks } from '@/context/TaskContext';

import { Task } from '@/types/task.types';

import { formatEstimate, formatProgress } from '@/utils/time.utils';

import TaskContextMenu from './TaskContextMenu';
import EditTask from './EditTask';
import { Subtask } from '@/types/subtask.types';
import SubtasksBlock from './SubtasksBlock';

const TaskComponent = ({ order, task }: { order: number; task: Task }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: task.id,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);

  const { updateTask, setActiveTask, getSubtasksByTaskId } = useTasks();

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const completeTime = 200;

  const { task_name: title, estimate } = task;

  const progress =
    task.progress > estimate ? task.progress : estimate - task.progress;

  const checkIsHovered = (value: boolean) => {
    setIsHovered(value);
  };

  const openEditTask = () => {
    setEditTaskOpen(true);
    checkIsHovered(false);
  };

  const [subtasksList, setSubtasks] = useState<Subtask[] | null>(null);

  useEffect(() => {
    const fetchSubtasks = async () => {
      const tasks = await getSubtasksByTaskId(task.id);
      if (tasks?.length === 0) return;


      setSubtasks(tasks);
    };

    fetchSubtasks();
  }, []);

  useEffect(() => { 
    console.log('subtasksList', subtasksList);
  }, [subtasksList])


  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseLeave={() => checkIsHovered(false)}
      onMouseEnter={() => checkIsHovered(!editTaskOpen && true)}
    >
      <div
        className={`min-h-[calc(60px)]  bg-gray-800 py-2 px-4 rounded-lg relative transition-all duration-${completeTime} ease-in-out ${
          isCompleting ? '-translate-y-10 opacity-0' : ''
        }`}
      >
        <div className="flex space-x-2 font-bold items-center  transition-all duration-200 ">
          <h1 className="text-gray-400 text-sm">{order}</h1>

          <div
            className={`overflow-hidden transition-all duration-100 ease-in-out z-20 ${
              isHovered ? 'w-5' : 'w-0 '
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
          <div
            className={`flex space-x-2 justify-end z-20 transition-opacity duration-100 ${isHovered ? 'opacity-100' : 'w-0 opacity-0'}`}
          >
            <QueueListIcon
              className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => {
                setSubtasks([]);
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
        <SubtasksBlock
          subtasks={subtasksList}
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
