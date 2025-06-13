import { useState } from "react";

import { useTasks } from "../context/TaskContext";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";

import { parseEstimate } from "../utils/time.utils";

const AddTaskComponent = ({
  className,
  children,
}: { className?: string; children?: React.ReactNode }) => {
  const [addingTask, setAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskEstimateString, setTaskEstimateString] = useState<string>("00:05");
  const [error, setError] = useState<string | null>(null);

  const { taskService } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName) {
      setError("Task name is required");
      return;
    }

    const parsedEstimate = parseEstimate(taskEstimateString);
    if (!parsedEstimate) {
      setError("Invalid estimate format. Use hh:mm or h:mm");
      return;
    }

    // taskService.createTask({
    //   title: taskName,
    //   estimate: parsedEstimate * 60,
    //   progress: 0,
    //   completed: false,
    //   created_at: new Date().toISOString(),
    //   updated_at: new Date().toISOString(),
    //   description: "",
    //   archived: false,
    //   task_list_id: 0,
    //   tags: [],
    //   priority: "none"
    // });

    setTaskName("");
    setTaskEstimateString("00:05");
    setError(null);
  };

  return (
    <div className={className}>
      <button
        type="button"
        className="flex cursor-pointer"
        onClick={() => {
          setAddingTask(!addingTask);
          setError(null);
          setTaskName("");
        }}
      >
        <PlusIcon
          className={`h-6 w-6 inline-block transition-transform duration-200 ${
            addingTask ? "rotate-45" : "rotate-0"
          }`}
          stroke="currentColor"
        />
        {!addingTask && <p className="pl-2 font-bold">ADD TASK</p>}
        {addingTask && <p className="pl-2 font-bold">CANCEL</p>}
      </button>

      <div
        className={`text-red-500 ${error ? "opacity-100" : "opacity-0 h-0"} transition-opacity duration-200`}
      >
        <ExclamationCircleIcon
          className={`h-5 w-5 inline-block ${error ? "opacity-100" : "opacity-0"}`}
        />
        {error}
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className={`flex flex-col transform transition-all duration-250 ease-in-out gap-2 ${
            addingTask
              ? "opacity-100 translate-y-0 max-h-96"
              : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
          }`}
        >
          <div className="flex space-x-2 ">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task"
              className={`border ${error ? "border-red-500" : "border-green-400"} rounded-md p-2 w-full placeholder:text-sm`}
            />
            <input
              type="text"
              value={taskEstimateString}
              onChange={(e) => {
                setTaskEstimateString(e.target.value);
              }}
              placeholder="hh:mm"
              className="border border-green-400 rounded-md p-2 w-16 placeholder:text-sm"
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
      {children}
    </div>
  );
};

export default AddTaskComponent;
