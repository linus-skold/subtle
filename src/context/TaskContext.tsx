'use client';
import { z } from 'zod';
import React, { createContext, useState, useContext, useEffect } from 'react';

export const TaskSchema = z.object({
  id: z.number(),
  task_name: z.string(),
  estimate: z.number().default(0),
  progress: z.number().default(0),
  completed: z.boolean().default(false),
  active: z.boolean().default(false),
});
export type Task = z.infer<typeof TaskSchema>;

export const PartialTaskSchema = TaskSchema.partial();
export type PartialTask = z.infer<typeof PartialTaskSchema>;

// define the context type
export interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;
  updateTask: (taskId: number, updatedTask: PartialTask) => void;
  activeTask: number | null;
  setActiveTask: React.Dispatch<React.SetStateAction<number | null>>;
  getTaskById: (taskId: number) => Task | null;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {
    throw new Error('setTasks function not implemented');
  },
  addTask: () => {
    throw new Error('addTask function not implemented');
  },
  removeTask: () => {
    throw new Error('removeTask function not implemented');
  },
  updateTask: () => {
    throw new Error('updateTask function not implemented');
  },
  activeTask: null,
  setActiveTask: () => {
    throw new Error('setActiveTask function not implemented');
  },
  getTaskById: () => {
    throw new Error('getTaskById function not implemented');
  },
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<number | null>(null);

  // useEffect(() => {
  //   const saveTasks = async () => {
  //     await saveToLocalStorage(tasks);
  //   };

  //   saveTasks(); // Call the async function
  // }, [tasks]);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const storedTasks = await readFromLocalStorage();
  //     setTasks(storedTasks ?? []); // If null or undefined, default to empty array
  //   };

  //   fetchTasks(); // Call the async function to fetch the tasks
  // }, []); // Empty dependency array to run only once on mount

  const addTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
  };

  const removeTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const updateTask = (taskId: number, updatedTask: PartialTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task,
      ),
    );
  };

  const getTaskById = (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
      return null;
    }
    return task;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        removeTask,
        updateTask,
        activeTask,
        setActiveTask,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
