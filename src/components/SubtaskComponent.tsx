import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconFilled } from '@heroicons/react/24/solid';
import { Subtask } from '@/types/subtask.types';
import { useTasks } from '@/context/TaskContext';

const SubtaskComponent = ({subtask, onChange}: {subtask: Subtask, onChange?: () => void}) => {
  const { updateSubtask, removeSubtask } = useTasks();
  const [isCompleted, setIsCompleted] = useState(subtask.completed);

  useEffect(() => {
    updateSubtask({
      ...subtask,
      completed: isCompleted,
    });
    onChange?.();
  }, [isCompleted]);

  return (
    <div className="flex items-center space-x-2 z-20">
      {!isCompleted && (
        <CheckCircleIcon
          className="h-4 w-4 text-gray-400 hover:text-green-400"
          onClick={() => setIsCompleted(!isCompleted)}
        />
      )}
      {isCompleted && (
        <CheckCircleIconFilled
          className="h-4 w-4 text-green-400"
          onClick={() => setIsCompleted(!isCompleted)}
        />
      )}

      <span
        className={`text-sm ${isCompleted ? 'line-through text-gray-500' : ''}`}
      >
        {subtask.subtask_name}
      </span>

      <TrashIcon
        className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer"
        onClick={() => removeSubtask(subtask.id, onChange)}
      />
    </div>
  );
};
export default SubtaskComponent;
