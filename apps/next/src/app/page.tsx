/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { version } from "../../../../package.json";
import React, { useEffect, useState, useLayoutEffect } from "react";

import {
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
  SlideoutComponent,
} from "@/components";

import { useTasks } from "../context/TaskContext";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import {
  PencilIcon,
  HomeIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Task } from "@db/schema/task.schema";
import NotesComponent from "@/components/NotesComponent";
import { useAppContext, type Setting } from "@/context";

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
  const { appService, setSettings } = useAppContext();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isStartup, setIsStartup] = useState(true);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [hasCleared, setHasCleared] = useState(false);
  const [clearedTasks, setClearedTasks] = useState<Task[]>([]);

  const [tasks, setTasks] = useState<Task[]>();
  const [activeTask, setActiveTask] = useState<Task>();

  const completedTasks = tasks?.filter((task) => task.completed);
  const completedTasksCount = completedTasks?.length || 0;
  const progress = (completedTasksCount / (tasks?.length || 1)) * 100;
  const progressText = `${completedTasksCount}/${tasks?.length || 0} DONE`;

  const taskContext = useTasks();

  useEffect(() => {
    const startup = async () => {
      try {
        taskContext.taskService
          .getTasks()
          .then((fetchedTasks: Task[]) => {
            setTasks(fetchedTasks.filter((task) => !task.archived));
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

      try {
        appService
          .getSettings()
          .then((fetchedSettings) => {
            setSettings(fetchedSettings as Setting[]);
          })
          .catch((error: unknown) => {
            console.error("Failed to fetch settings:", error);
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
      // updateState({ isCompactMode: true });
    } else {
      // updateState({ isCompactMode: false });
    }
  }, [width]);

  useEffect(() => {
    setSettingsOpen(isSettingsModalOpen);
  }, [isSettingsModalOpen]);

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

  function handleClearTasks() {
    if (!hasCleared) {
      const toClear = tasks.filter((task) => task.completed);

      setClearedTasks(toClear);

      setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));

      toClear.forEach((task) => {
        updateTask({ ...task, archived: true });
      });
      setHasCleared(true);
    } else {
      setTasks((prevTasks) => [...prevTasks, ...clearedTasks]);
      clearedTasks.forEach((task) => {
        updateTask({ ...task, archived: false });
      });
      setClearedTasks([]);
      setHasCleared(false);
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
    // check if we are completing a task
    if (updatedTask.completed && !updatedTask.active) {
      setHasCleared(false);
    }

    taskContext.taskService
      .updateTask({ ...updatedTask })
      .then((task) => {
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((t: Task) => (t.id === task.id ? task : t))
      );
      })
      .catch((error: unknown) => {
        console.error("Failed to update task:", error);
      });
  };

  const completeTask = (taskId: number) => {
    updateTask({
      ...tasks.find((task) => task.id === taskId),
      completed: true,
    });
    setActiveTask(null);
  };

  const toggleNoteMode = () => {
    setSettingsOpen(false);
    const nextMode = !isEditingNote;
    if (!nextMode) {
      setIsEditingNote(false);
    }
    // updateState({ isNoteMode: !noteMode });

    window.electronAPI
      .invoke("change-window-size", {
        width: nextMode ? 900 : 400, // Adjust width based on note mode
        height: 900, // Keep height consistent
      })
      .then(() => {
        setIsEditingNote(nextMode);
        console.log("Window size updated");
      })
      .catch((error: unknown) => {
        console.error("Failed to update window size:", error);
      });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <main id="app" className={`h-screen select-none flex flex-col`}>
          {!isFocusMode && (
            <div className="shrink-0 h-6 z-100">
              {" "}
              <TitlebarComponent />
            </div>
          )}

          <div className="flex h-screen">
            <div className="w-[64px] h-screen bg-gray-800 flex flex-col flex-shrink-0 items-center gap-8 z-100">
              <HomeIcon className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" />
              <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" />
              <PencilIcon
                className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                onClick={toggleNoteMode}
              />
              <Cog6ToothIcon
                className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer "
                onClick={() => setSettingsOpen(true)}
              />
            </div>

            <SlideoutComponent isOpen={isEditingNote} onClose={toggleNoteMode}>
              <NotesComponent />
            </SlideoutComponent>

            <SlideoutComponent
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            >
              <SettingsModal />
            </SlideoutComponent>

            <div className="flex flex-col flex-1 h-screen gap-4 p-4 overflow-auto">
              <ActivityBar />
              {activeTask && (
                <ActiveTask task={activeTask} onComplete={completeTask} onChange={updateTask} />
              )}

              <ProgressBar progress={progress} text={progressText} />
              <TaskList className="min-h-0 max-h-[75%]">
                {tasks.length > 0 &&
                  tasks
                    .filter((task) => !task.completed && !task?.active)
                    .map((task, index) => (
                      <TaskComponent
                        disableHover={isSettingsModalOpen}
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
                          const taskToStart = tasks.find(
                            (t) => t.id === taskId,
                          );
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

              {clearedTasks.length > 0 && (
                <div
                  className="text-gray-400 hover:text-gray-300 text-sm text-center"
                  onClick={() => handleClearTasks()}
                >
                  {!hasCleared && <span>Clear list</span>}
                  {hasCleared && <span>Undo</span>}
                </div>
              )}

              {clearedTasks.length <= 0 && (
                <div className="text-gray-400 hover:text-gray-300 text-sm text-center">
                  <span>All caught up</span>
                </div>
              )}

              <TaskList className="flex-[1_1_25%]">
                {tasks.length > 0 &&
                  tasks
                    .filter((task) => task.completed)
                    .map((task) => (
                      <CompletedTask
                        key={task.id}
                        task={task}
                        onArchive={() => updateTask({ ...task, archived: true })}
                        onUncomplete={() =>
                          updateTask({ ...task, completed: false })
                        }
                      />
                    ))}
              </TaskList>

              <div className="w-full h-8 pb-4 bg-[var(--background)] flex items-center justify-center">
                <p className="text-sm">
                  Version: <span className="text-blue-400">{version}</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </SortableContext>
    </DndContext>
  );
}
