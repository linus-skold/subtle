/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
"use client";
import { TaskComponent } from "@/components/Task";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import ContextMenuItem from "@/components/ContextMenuItem";

import { CheckCircleIcon } from "@heroicons/react/24/outline";

import {
  addTask,
  createTable,
  deleteAllTasks,
  deleteTask,
  loadTasks,
  setDatabase,
  type Task,
  type TaskInsert,
} from "@/helpers/databaseHelpers";

import AddTaskComponent from "@/components/AddTaskComponent";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<number>(-1);
  const [selectedItem, setSelectedItem] = useState<number>(-1);


  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default context menu
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedItem(hovered);
    setMenuVisible(true);
  };

  const handleClickOutside = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadDB = async () => {
      await setDatabase();
      await createTable();

      loadTasks()
        .then((tasks) => {
          const buildTaskHierarchy = (
            tasks: Task[],
            parentId: number | null = null
          ): Task[] => {
            return tasks
              .filter((task) => task.parent_id === parentId)
              .map((task) => ({
                task_name: task.task_name,
                completed: task.completed,
                id: task.id,
                parent_id: task.parent_id,
                subtasks: buildTaskHierarchy(tasks, task.id), // Recursively add subtasks
              }));
          };
          const taskTree = buildTaskHierarchy(tasks);
          setTasks(taskTree);
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    };

    loadDB()
      .then(() => {
        console.log("DB loaded");
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    // Event listener for the "Enter" key press
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const task: TaskInsert = { task_name: inputValue };

        addTask(task)
          .then((result) => {
            console.log(result);
            if (result.lastInsertId) {
              const newTask: Task = {
                task_name: inputValue,
                id: result.lastInsertId,
              };
              setTasks((prevTasks) => [...prevTasks, newTask]);
            }
          })
          .catch((err: unknown) => {
            console.error(err);
          });
        setInputValue("");
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [inputValue]);

  return (
      <div className="p-4">
        <div className="flex flex-col" onContextMenu={handleRightClick}>
          {menuVisible && (
            <div
              className="text-sm bg-gray-900 border-solid border-1 border-gray-800 dark:border-gray-700"
              style={{
                position: "absolute",
                top: `${menuPosition.y}px`,
                left: `${menuPosition.x}px`,
                borderRadius: "5px",
                zIndex: 1000,
              }}
            >
              <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                <ContextMenuItem
                  menuIcon={CheckCircleIcon}
                  label="Duplicate task"
                  onClick={() => {
                    alert("Action 3");
                  }}
                />
                <ContextMenuItem
                  menuIcon={CheckCircleIcon}
                  label="Create follow-up task"
                  onClick={() => {
                    alert("Action 3");
                  }}
                />
                <ContextMenuItem
                  menuIcon={CheckCircleIcon}
                  label="Mark completed"
                  onClick={() => {
                    alert("Action 3");
                  }}
                />
                <ContextMenuItem
                  menuIcon={CheckCircleIcon}
                  label="Add subtask"
                  onClick={() => {
                    alert("Action 3");
                  }}
                />

                <hr className="h-px w-full bg-gray-200 border-0 dark:bg-gray-700" />
                <ContextMenuItem
                  className="text-red-500 pt-2 hover:bg-gray-800"
                  menuIcon={TrashIcon}
                  label="Delete task"
                  onClick={() => {
                    deleteTask(selectedItem)
                      .then(() => {
                        const filtered = tasks.filter(
                          (task) => task.id !== selectedItem
                        );
                        setTasks(filtered);
                      })
                      .catch((err: unknown) => {
                        console.error(err);
                      });
                  }}
                />
                <ContextMenuItem
                  className="text-red-500 pt-2 hover:bg-gray-800"
                  menuIcon={TrashIcon}
                  label="Delete all tasks"
                  onClick={() => {
                    deleteAllTasks().then(() => {
                      console.log("All tasks deleted");
                      setMenuVisible(false);
                      setHovered(-1);
                      setSelectedItem(-1);
                      setInputValue("");
                    }).catch((err: unknown) => {
                      console.error(err);
                    });
                    setTasks([]);
                  }}
                />
              </ul>
            </div>
          )}

          {tasks.map((task) => {
            return (
              <TaskComponent
                task_name={task.task_name}
                key={task.id}
                id={task.id}
                completed={task.completed}
                subtasks={task.subtasks}
                level={0}
                onHover={(x: number) => setHovered(x)}
              />
            );
          })}
        </div>

        <AddTaskComponent
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
  );
}
