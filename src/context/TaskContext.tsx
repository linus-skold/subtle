'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

import { Task, PartialTask, TaskInsert } from '@/types/task.types';

import * as dbHelper from '@/utils/database.utils';
import { PartialSubtask, Subtask, SubtaskInsert } from '@/types/subtask.types';

export interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: TaskInsert) => void;
  removeTask: (taskId: number) => void;
  updateTask: (taskId: number, updatedTask: PartialTask) => void;
  activeTask: number | null;
  setActiveTask: React.Dispatch<React.SetStateAction<number | null>>;
  getTaskById: (taskId: number) => Task | null;
  getSubtasksByTaskId: (taskId: number) => Promise<Subtask[] | null>;
  addSubtask: (
    parentTaskId: number,
    subtask: SubtaskInsert,
    onAdd: () => void,
  ) => void;
  updateSubtask: (subtask: PartialSubtask, onChange?: () => void) => void;
  removeSubtask: (subtaskId: number, onRemove?: () => void) => void;
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
  getSubtasksByTaskId: () => {
    throw new Error('getSubtasksByTaskId function not implemented');
  },
  addSubtask: () => {
    throw new Error('addSubtask function not implemented');
  },
  updateSubtask: () => {
    throw new Error('updateSubtask function not implemented');
  },
  removeSubtask: () => {
    throw new Error('removeSubtask function not implemented');
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
    startup()
      .then(() => {
        console.log('Database initialized and tasks loaded');
      })
      .catch((error: unknown) => {
        console.error('Error loading tasks:', error);
      });
  }, []);

  const addTask = (task: TaskInsert) => {
    dbHelper
      .addTask(task)
      .then((result) => {
        if (typeof result.lastInsertId === 'number') {
          const newId = result.lastInsertId; // now definitely a number
          setTasks((prevTasks) => [
            ...prevTasks,
            {
              ...task,
              completed: false,
              active: false,
              overtime: false,
              id: newId,
            },
          ]);
        }
      })
      .catch((error: unknown) => {
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
      .updateTask({ ...task, ...updatedTask })
      .then(() => {
        console.log('Task updated successfully', {
          task: { ...task, ...updatedTask },
          id: taskId,
        });
      })
      .catch((error: unknown) => {
        console.error('Error updating task:', error, {
          task: { ...task, ...updatedTask },
          id: taskId,
        });
      });
  };

  const getTaskById = (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
      return null;
    }
    return task;
  };

  const getSubtasksByTaskId = async (taskId: number) => {
    return dbHelper.getSubtasksByParentId(taskId);
  };

  const addSubtask = (
    parentTaskId: number,
    subtask: SubtaskInsert,
    onAdd?: () => void,
  ) => {
    dbHelper
      .addSubtask({ ...subtask, parent_task_id: parentTaskId })
      .then((result) => {
        console.log(result);
        onAdd?.();
      })
      .catch((error: unknown) => {
        console.error('Error adding subtask:', error);
      });
  };

  const updateSubtask = (subtask: PartialSubtask, onChange?: () => void) => {
    dbHelper
      .updateSubtask(subtask)
      .then(() => {
        console.log('Subtask updated successfully', subtask);
        onChange?.();
      })
      .catch((error: unknown) => {
        console.error('Error updating subtask:', error, subtask);
      });
  };

  const removeSubtask = (subtaskId: number, onRemove?: () => void) => {
    dbHelper.deleteSubtask(subtaskId)
      .then(() => {
        console.log('Subtask removed successfully', subtaskId);
        onRemove?.();
      })
      .catch((error: unknown) => {
        console.error('Error removing subtask:', error, subtaskId);
      });
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
        getSubtasksByTaskId,
        addSubtask,
        updateSubtask,
        removeSubtask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
