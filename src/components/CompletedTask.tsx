import { Task } from '@/types/task.types';
import { formatProgress } from '@/utils/time.utils';

const CompletedTask = ({ task }: { task: Task }) => {
  return (
    <div className="text-sm px-4 py-2 bg-gray-800 rounded-lg flex justify-between">
      <h1 className="strike-through text-gray-400">{task.task_name}</h1>
      <h1 className="text-white">{formatProgress(task.progress)}</h1>
    </div>
  );
};

export default CompletedTask;
