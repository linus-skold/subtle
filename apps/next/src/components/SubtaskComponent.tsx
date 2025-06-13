import { useTasks } from "../context/TaskContext";
import type { Subtask } from "../../../types/subtask.types";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconFilled } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";

const SubtaskComponent = ({
  subtask,
  onChange,
}: { subtask: Subtask; onChange?: () => void }) => {
  const { updateSubtask, removeSubtask } = useTasks();

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const isActive = useRef(false);

  useEffect(() => {
    if (isActive && subtask) {
      setIsCompleted(subtask.completed);
    }
  }, [subtask]);

  useEffect(() => {
    if (!isActive.current) {
      isActive.current = true;
      return;
    }

    updateSubtask(
      {
        ...subtask,
        completed: isCompleted,
      },
      onChange,
    );
  }, [isCompleted, updateSubtask, subtask, onChange]);

  return (
    <div className="flex items-center justify-between space-x-2 z-20">
      <div className="flex items-center space-x-2">
        {!isCompleted && (
          <CheckCircleIcon
            className="h-4 w-4 text-gray-400 hover:text-green-400"
            onClick={() => setIsCompleted(true)}
          />
        )}
        {isCompleted && (
          <CheckCircleIconFilled
            className="h-4 w-4 text-green-400"
            onClick={() => setIsCompleted(false)}
          />
        )}

        <span
          className={`text-sm ${isCompleted ? "line-through text-gray-500" : ""}`}
        >
          {subtask.subtask_name}
        </span>
      </div>

      <TrashIcon
        className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer"
        onClick={() => removeSubtask(subtask.id, onChange)}
      />
    </div>
  );
};
export default SubtaskComponent;
