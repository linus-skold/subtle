/* eslint-disable @typescript-eslint/no-empty-function */

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { Task } from "@db/schema/task.schema";
import { Subtask } from "@db/schema/subtask.schema";

const taskService = {
  getTasks: () => window.electronAPI.invoke<Task[]>("get-tasks"),
  createTask: (task: Task) => window.electronAPI.invoke<Task>("create-task", task),
  updateTask: (task: Task) => window.electronAPI.invoke<Task>("update-task", task),
  deleteTask: (taskId: number) =>
    window.electronAPI.invoke("delete-task", taskId),
  getSubtasks: (taskId: number) =>
    window.electronAPI.invoke<Subtask[]>("get-subtasks", taskId),

  updateSubtask: (subtask: Subtask) => {
    return window.electronAPI
      .invoke("update-subtask", subtask)
      .then((updated: Subtask) => {
        return updated;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  },

  deleteSubtask: (id: number) => {
    return window.electronAPI
      .invoke("delete-subtask", id)
      .then(() => {
        return id;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  },

  addSubtask: (subtask: Subtask) => {
    return window.electronAPI
      .invoke("create-subtask", subtask)
      .then((newSubtask: Subtask) => {
        return newSubtask;
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  },
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
