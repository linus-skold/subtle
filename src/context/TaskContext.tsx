/* eslint-disable @typescript-eslint/no-empty-function */

import type React from "react";
import { createContext, useContext, useState } from "react";



type TaskService = {
  loadTasks: () => Promise<Task[]>;
  addTask: (task: TaskInsert) => Promise<{ lastInsertId: number }>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  getSubtasksByParentId: (taskId: number) => Promise<Subtask[]>;
  addSubtask: (subtask: SubtaskInsert) => Promise<void>;
  updateSubtask: (subtask: PartialSubtask) => Promise<void>;
  deleteSubtask: (subtaskId: number) => Promise<void>;
};


export interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTask: number | null;
  setActiveTask: React.Dispatch<React.SetStateAction<number | null>>;
  taskService?: TaskService;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
  activeTask: null,
  setActiveTask: () => {},
  taskService: undefined,
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<number | null>(null);

  return (
    <TaskContext.Provider
      value={{
    
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
