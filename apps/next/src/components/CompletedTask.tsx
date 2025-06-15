import React, { useState } from "react";
import type { Task } from "@db/schema/task.schema";
import { formatProgress } from "../utils/time.utils";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";

const CompletedTask = ({ task }: { task: Task }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="text-sm px-4 py-2 bg-gray-800 rounded-lg flex justify-between items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm line-through text-gray-500">{task.title}</span>

      <div className="flex items-center justify-end w-24 relative">
        {/* Progress */}
        <span
          className={`text-white absolute right-0 transition-opacity duration-200 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          {formatProgress(task.progress)}
        </span>

        {/* Archive Icon */}
        <ArchiveBoxArrowDownIcon
          className={`h-5 w-5 text-gray-400 hover:text-blue-500 transition-opacity duration-200 cursor-pointer absolute right-0 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => {
            console.log(`Archiving task: ${task.id}`);
          }}
        />
      </div>
    </div>
  );
};

export default CompletedTask;
