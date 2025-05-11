import { useState } from 'react';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useTasks } from '@/context/TaskContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const AddTaskComponent = () => {
  const [addingTask, setAddingTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskEstimate, setTaskEstimate] = useState<number>(0);
  const [taskEstimateString, setTaskEstimateString] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const parseTaskEstimate = (estimate: string) => {
    if (estimate.includes('h')) {
      const parts = estimate.split('h');
      const hours = parseInt(parts[0], 10);
      if (estimate.includes('m')) {
        const minutes = parseInt(parts[1].replace('m', ''), 10);
        setTaskEstimate(hours * 60 + minutes);
        return;
      }

      const minutes = parseInt(parts[1], 10);
      setTaskEstimate(hours * 60 + minutes);
    }

    const parts = estimate.split(':');
    if (parts.length === 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      setTaskEstimate(hours * 60 + minutes);
    }
  };

  const { addTask, tasks } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName) {
      setError('Task name is required');
      return;
    }

    console.log('Adding task:', taskName, taskEstimate);
    addTask({
      id: tasks.length + 1,
      task_name: taskName,
      estimate: taskEstimate,
      progress: 0,
      completed: false,
      active: false,
    });

    setTaskName('');
    setTaskEstimate(0);
    setTaskEstimateString('');
    setError(null);
  };

  return (
    <div className="mx-4">
      <button
        className="flex cursor-pointer"
        onClick={() => setAddingTask(!addingTask)}
      >
        <PlusIcon
          className={`h-6 w-6 inline-block transition-transform duration-200 ${
            addingTask ? 'rotate-45' : 'rotate-0'
          }`}
          stroke="currentColor"
        />
        {!addingTask && <p className="pl-2 font-bold">ADD TASK</p>}
        {addingTask && <p className="pl-2 font-bold">CANCEL</p>}
      </button>

      <div
        className={`text-red-500 ${error ? 'opacity-100' : 'opacity-0 h-0'} transition-opacity duration-200`}
      >
        <ExclamationCircleIcon
          className={`h-5 w-5 inline-block ${error ? 'opacity-100' : 'opacity-0'}`}
        />
        {error}
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className={`flex flex-col mt-2 transform transition-all duration-250 ease-in-out ${
            addingTask
              ? 'opacity-100 translate-y-0 max-h-96'
              : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden'
          }`}
        >
          <div className="flex space-x-2 ">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task"
              className={`border ${error ? 'border-red-500' : 'border-green-400'} rounded-md p-2 mb-2 w-full placeholder:text-sm`}
            />
            <input
              type="text"
              value={taskEstimateString}
              onChange={(e) => {
                setTaskEstimateString(e.target.value);
                parseTaskEstimate(e.target.value);
              }}
              placeholder="hh:mm"
              className="border border-green-400 rounded-md p-2 mb-2 w-16 placeholder:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="cursor-pointer text-white bg-gradient-to-r from-green-400 to-blue-500 
          rounded-full px-8 py-2 self-start text-gray-700 font-bold"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTaskComponent;
