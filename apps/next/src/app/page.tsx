/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { version } from "../../../../package.json";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

import {
  App,
  ActiveTask,
  ActivityBar,
  AddTaskComponent,
  SettingsModal,
  TaskList,
  TaskComponent,
  TitlebarComponent,
  LoadingSpinner,
  ProgressBar,
  CompletedTask,
} from "@/components";

import { useAppContext } from "../context/AppContext";
import { useTasks } from "../context/TaskContext";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Task } from "@db/schema/task.schema";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default function Home() {
  const { state, updateState } = useAppContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isStartup, setIsStartup] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task>(null);

  const completedTasks = tasks.filter((task) => task.completed);
  const completedTasksCount = completedTasks.length;
  const progress = (completedTasksCount / tasks.length) * 100;
  const progressText = `${completedTasksCount}/${tasks.length} DONE`;

  const taskContext = useTasks();

  useEffect(() => {
    const startup = async () => {
      try {
        taskContext.taskService
          .getTasks()
          .then((fetchedTasks) => {
            setTasks(fetchedTasks as Task[]);
          })
          .catch((error: unknown) => {
            console.error("Failed to fetch tasks:", error);
          });
        setTimeout(() => {
          // Simulate a delay for startup
          setIsStartup(false);
        }, 1000);
      } catch (error) {
        console.error("Error during database initialization:", error);
      }
    };

    if (isStartup) {
      startup()
        .then(() => {
          console.log("Startup completed successfully");
        })
        .catch((error: unknown) => {
          console.error("Error during startup:", error);
        });
    }
  }, [isStartup]);

  const [width] = useWindowSize();
  useEffect(() => {
    if (width < 800) {
      updateState({ isCompactMode: true });
    } else {
      updateState({ isCompactMode: false });
    }
  }, [width]);

  useEffect(() => {
    setSettingsOpen(state.isSettingsModalOpen);
  }, [state.isSettingsModalOpen]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over?.id);

        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  }

  if (isStartup) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const addTask = (newTask: Task) => {
    taskContext.taskService
      .createTask(newTask)
      .then((result) => {
        setTasks((prevTasks) => [...prevTasks, result]);
      })
      .catch((error: unknown) => {
        console.error("Failed to create task:", error);
      });
  };

  const removeTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    taskContext.taskService.deleteTask(taskId).catch((error: unknown) => {
      console.error("Failed to delete task:", error);
    });
  };

  const updateTask = (updatedTask: Task) => {
    taskContext.taskService
      .updateTask({ ...updatedTask, completed: true })
      .then((task) => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task.id ? task : t)),
        );
      })
      .catch((error: unknown) => {
        console.error("Failed to update task:", error);
      });
  };

  const completeTask = (taskId: number) => {
    updateTask(tasks.find((task) => task.id === taskId));
    setActiveTask(null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <App>
          {!state.isFocusMode && <TitlebarComponent />}
          <div className="flex flex-col h-screen gap-4 p-4">
            <ActivityBar />
            {activeTask && <ActiveTask task={activeTask} onComplete={completeTask} />}

            <ProgressBar progress={progress} text={progressText} />
            <TaskList className="min-h-0 max-h-[75%]">
              {tasks.length > 0 &&
                tasks
                  .filter((task) => !task.completed && !task?.active)
                  .map((task, index) => (
                    <TaskComponent
                      key={task.id}
                      order={index + 1}
                      task={task}
                      taskId={task.id}
                      onDelete={() => removeTask(task.id)}
                      onComplete={() =>
                        updateTask({
                          ...task,
                          completed: true,
                        })
                      }
                      onStart={(taskId) => {
                        const taskToStart = tasks.find((t) => t.id === taskId);
                        console.log("Starting task:", taskToStart);
                        if (taskToStart) {
                          setTasks((prevTasks) =>
                            prevTasks.map((t) =>
                              t.id === taskToStart.id
                                ? { ...t, active: true }
                                : { ...t, active: false },
                            ),
                          );
                          setActiveTask(taskToStart);
                        }
                      }}
                    />
                  ))}
            </TaskList>

            <AddTaskComponent
              className="flex flex-col gap-2 shrink-0"
              onAdd={addTask}
            >
              <div className="h-[2px] mx-12 bg-gradient-to-r from-green-400 to-blue-500 border-0 rounded-full" />
            </AddTaskComponent>
            <TaskList className="flex-[1_1_25%]">
              {tasks.length > 0 &&
                tasks
                  .filter((task) => task.completed)
                  .map((task) => <CompletedTask key={task.id} task={task} />)}
            </TaskList>
            <div className="w-full h-8 pb-4 bg-[var(--background)] flex items-center justify-center">
              <p className="text-sm">{version}</p>
            </div>
          </div>

          <SettingsModal
            isOpen={settingsOpen}
            onClick={() => {
              updateState({ isSettingsModalOpen: false });
            }}
          />
        </App>
      </SortableContext>
    </DndContext>
  );
}
