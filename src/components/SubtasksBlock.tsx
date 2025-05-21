import React, { useState } from 'react';

import SubtaskComponent from '@/components/SubtaskComponent';
import { PartialSubtask } from '@/types/subtask.types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ProgressDonut from './DonutProgressBar';
import InputComponent from './InputComponent';

import { useTasks } from '@/context/TaskContext';

const SubtasksBlock = ({
  subtasks,
  parentId,
  onSubtaskChange,
  show,
}: {
  subtasks: PartialSubtask[] | null;
  parentId: number;
  onSubtaskChange: () => void;
  show?: boolean;
}) => {
  const [subtasksOpen, setSubtasksOpen] = useState(false);

  const { addSubtask } = useTasks();

  const [ addingSubtasks, setAddingSubtasks ] = useState(false);

  const completedTasks = subtasks?.filter((task) => task.completed === true);
  const completedTasksCount = completedTasks ? completedTasks.length : 0;

const progress = subtasks?.length
  ? (100 * completedTasksCount) / subtasks.length
  : 0;
  if (!show) {
    return <></>;
  }

  return (
    <div>
      <hr className="w-full bg-gray-700 h-1 rounded-lg mt-2" />
      <div className="relative flex justify-between items-center mt-2 z-20">
        <div className="flex items-center space-x-2">
          <ProgressDonut
            progress={progress}
            size={24}
          />
          <p className="text-center text-gray-400 text-sm ml-2">
            {completedTasksCount}/{subtasks.length}
          </p>
          <p className="text-sm font-bold hover:text-green-400 cursor-pointer" onClick={() => setAddingSubtasks(!addingSubtasks)}>+</p>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 hover:text-green-400 inline-block mr-1 ${subtasksOpen ? 'rotate-180' : ''}`}
          onClick={() => setSubtasksOpen(!subtasksOpen)}
        />
      </div>
      {subtasksOpen && (
        <div className="z-20 relative flex flex-col mt-2">

          <InputComponent<string> onKeyDown={(_, value) => { 
            // add new subtask to database and tell parent to update
            addSubtask(
              parentId,
              {
                subtask_name: value,
                completed: false,
                parent_task_id: parentId,
              },
              () => { onSubtaskChange() },
            );

          }} show={addingSubtasks}/>

          <div
            className={`flex flex-col space-y-2 mt-2 transition-opacity duration-200 ${subtasksOpen ? 'block' : 'hidden'}`}
          >
            {subtasks?.map((subtask, index) => (
              <SubtaskComponent
                key={index}
                subtask={subtask}
                onChange={() => {
                  onSubtaskChange();
                }}                
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtasksBlock;
