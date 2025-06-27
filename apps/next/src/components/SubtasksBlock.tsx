import React, { useState } from "react";
import type { Subtask } from "@db/schema/subtask.schema";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { DonutProgressBar, InputComponent } from "@/components";

const SubtasksBlock = ({
  show,
  subtasks,
  onAddSubtask,
  expanded,
  children,
}: {
  show?: boolean;
  subtasks: Subtask[];
  parentId: number;
  onAddSubtask?: (subtask: Subtask) => void;
  expanded?: boolean;
  children?: React.ReactNode;
}) => {
  const [subtasksOpen, setSubtasksOpen] = useState(expanded ?? false);

  const [addingSubtasks, setAddingSubtasks] = useState(expanded ?? false);

  const completedTasks = subtasks?.filter((task) => task.completed);
  const completedTasksCount = completedTasks ? completedTasks.length : 0;

  const progress = subtasks?.length
    ? (100 * completedTasksCount) / subtasks.length
    : 0;

  if (!show) {
    return <></>;
  }

  return (
    <div className="">
      <hr className="w-full bg-gray-700 h-1 rounded-lg mt-2" />
      <div className="relative flex justify-between items-center mt-2 z-20">
        <div className="flex items-center space-x-2">
          <DonutProgressBar progress={progress} size={24} />
          <p className="text-center text-gray-400 text-sm ml-2">
            {completedTasksCount}/{subtasks.length}
          </p>
          <p
            className="text-sm font-bold hover:text-green-400 cursor-pointer"
            onClick={() => {
              setAddingSubtasks(!addingSubtasks);
              setSubtasksOpen(true);
            }}
          >
            +
          </p>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 hover:text-green-400 inline-block mr-1 ${subtasksOpen ? "rotate-180" : ""}`}
          onClick={() => setSubtasksOpen(!subtasksOpen)}
        />
      </div>
      {subtasksOpen && (
        <div className="z-20 relative flex flex-col mt-2">
          <InputComponent<string>
            className="focus:outline-hidden focus:border-green-400 border-b-2 relative"
            onKeyDown={(_, value) => {
              onAddSubtask?.({
                title: value,
                completed: false,
              } as Subtask);
            }}
            show={addingSubtasks}
            onClose={() => setAddingSubtasks(false) }
          />

          <div
            className={`flex flex-col space-y-2 mt-2 transition-opacity duration-200 ${subtasksOpen ? "block" : "hidden"}`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtasksBlock;
