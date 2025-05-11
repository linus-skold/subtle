import { Task } from "@/context/TaskContext";
import { parseProgress } from "@/utils/time.utils";


const CompletedTask = ({ task }: { task: Task }) => {
  return (
    <div className="text-sm">
      <div className="mx-4 my-2 rounded-lg">
        <div className="px-4 py-2 bg-gray-800 rounded-lg flex justify-between">
          <h1 className="strike-through text-gray-400">{task.task_name}</h1>
          <h1 className="text-white">{parseProgress(task.progress)}</h1>

        </div>
      </div>
    </div>
  );
};

export default CompletedTask;
