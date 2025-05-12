'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

import { Task, PartialTask, TaskInsert } from '@/types/task.types';

import * as dbHelper from '@/utils/database.utils';

export interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: TaskInsert) => void;
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

  useEffect(() => {
    const startup = async () => {

      await dbHelper.setDatabase();
      await dbHelper.createTable();
      const tasks = await dbHelper.loadTasks();
      setTasks(tasks);
    };
    startup().then(() => {
      console.log('Database initialized and tasks loaded');
    }).catch((error) => {
      console.error('Error loading tasks:', error);
    }
    );
  }, [])


  const addTask = (task: TaskInsert) => {
    dbHelper
      .addTask(task)
      .then((result) => {
        setTasks((prevTasks) => [...prevTasks, { ...task, id: result.lastInsertId }]);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
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

    // get the task by id
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }
    // update the task in the database

    dbHelper
      .updateTask({...task, ...updatedTask})
      .then(() => {
        console.log('Task updated successfully',  { task: {...task, ...updatedTask}, id: taskId });
      })
      .catch((error) => {
        console.error('Error updating task:', error, { task: {...task, ...updatedTask}, id: taskId });
      });

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
