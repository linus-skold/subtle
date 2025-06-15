/* eslint-disable @typescript-eslint/no-empty-function */

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { Task } from "@db/schema/task.schema";
import { Subtask } from "@db/schema/subtask.schema";

const taskService = {
  getTasks: () => window.electronAPI.invoke("get-tasks"),
  createTask: (task: Task) => window.electronAPI.invoke("create-task", task),
  updateTask: (task: Task) => window.electronAPI.invoke("update-task", task),
  deleteTask: (taskId: number) => window.electronAPI.invoke("delete-task", taskId),
  getSubtasks: (taskId: number) =>
    window.electronAPI.invoke("get-subtasks", taskId),
  createSubtask: (subtask: Subtask) =>
    window.electronAPI.invoke("create-subtask", subtask),
  deleteSubtask: (subtaskId: number) =>
    window.electronAPI.invoke("delete-subtask", subtaskId),
  updateSubtask: (subtask: Subtask) =>
    window.electronAPI.invoke("update-subtask", subtask),
};

type TaskService = typeof taskService;

export interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  taskService?: TaskService;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
  taskService,
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    taskService
      .getTasks()
      .then((tasks) => {
        setTasks(tasks as Task[]);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch tasks:", error);
      });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        taskService,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
