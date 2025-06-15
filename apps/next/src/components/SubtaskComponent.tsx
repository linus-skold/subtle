import type { Subtask } from "@db/schema/subtask.schema";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconFilled } from "@heroicons/react/24/solid";

const SubtaskComponent = ({
  subtask,
  onChange,
  onRemove,
}: { subtask: Subtask; onChange?: (subtask: Subtask) => void; onRemove?: (id: number) => void }) => {

  const setIsCompleted = (completed: boolean) => {
    onChange({
      ...subtask,
      completed,
    });
  };

  return (
    <div className="flex items-center justify-between space-x-2 z-20">
      <div className="flex items-center space-x-2">
        {!subtask.completed && (
          <CheckCircleIcon
            className="h-4 w-4 text-gray-400 hover:text-green-400"
            onClick={() => setIsCompleted(true)}
          />
        )}
        {subtask.completed && (
          <CheckCircleIconFilled
            className="h-4 w-4 text-green-400"
            onClick={() => setIsCompleted(false)}
          />
        )}

        <span
          className={`text-sm ${subtask.completed ? "line-through text-gray-500" : ""}`}
        >
          {subtask.title}
        </span>
      </div>

      <TrashIcon
        className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer"
        onClick={() => onRemove?.(subtask.id)}
      />
    </div>
  );
};
export default SubtaskComponent;
