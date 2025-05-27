import type { Task } from "@/types/task.types";
import { formatProgress } from "@/utils/time.utils";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";

const CompletedTask = ({ task }: { task: Task }) => {
  return (
    <div className="text-sm px-4 py-2 bg-gray-800 rounded-lg flex justify-between">
      <span className="text-sm line-through text-gray-500">{task.title}</span>
      <h1 className="text-white">{formatProgress(task.progress)}</h1>
      <ArchiveBoxArrowDownIcon
        className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
        onClick={() => {
          // Logic to archive the task
          console.log(`Archiving task: ${task.id}`);
        }}
      />
    </div>
  );
};

export default CompletedTask;
