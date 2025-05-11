import Dropdown from './Dropdown';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
import { useTasks } from '@/context/TaskContext';

const ActivityBar = () => {
  const { state, updateState } = useAppContext();

  const { tasks } = useTasks();
  const completedTasks = tasks.filter((task) => task.completed);
  const completedTasksCount = completedTasks.length;
  const totalTasksCount = tasks.length;
  const progress = (completedTasksCount / totalTasksCount) * 100;
  const progressText = `${completedTasksCount}/${totalTasksCount} DONE`;


  return (
    <div className="m-4">
      <div className="flex justify-between mb-4">
        <div className="flex">
          {/* <Dropdown /> */}
          <h1 className="text-xl font-bold">Today</h1>
        </div>
        <div className="flex space-x-4">
          <Cog6ToothIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
          <HomeIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
          <BoltIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
      <ProgressBar progress={progress} text={progressText} />
    </div>
  );
};

export default ActivityBar;
