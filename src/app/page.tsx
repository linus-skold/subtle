'use client';
import React, { useEffect, useState, useLayoutEffect } from 'react';


import AddTaskComponent from '@/components/AddTask';
import { SidebarComponent } from '@/components/Sidebar';
import { TitlebarComponent } from '@/components/Titlebar';
import { App } from '@/components/App';
import TaskList from '@/components/TaskList';
import Task2 from '@/components/Task2';
import ActivityBar from '@/components/ActivityBar';
import ActiveTask from '@/components/ActiveTask';
import CompletedTask from '@/components/CompletedTask';
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppContext } from '@/context/AppContext';
import { useTasks } from '@/context/TaskContext';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function Home() {
  const { state, updateState } = useAppContext();
  const { tasks, setTasks, activeTask } = useTasks();

  const [width ] = useWindowSize();
  useEffect(() => {
    if (width < 800) {
      updateState({ isCompactMode: true });
    } else {
      updateState({ isCompactMode: false });
    }
  }, [width]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);

        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <App className="">
          {!state.isFocusMode && <TitlebarComponent />}
          {!state.isCompactMode && !state.isFocusMode && <SidebarComponent />}
          <div className="m-2">
            <ActivityBar />

            { activeTask && <ActiveTask /> }
            <TaskList className="overflow-y-scroll max-h-[calc(380px)] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {tasks.length > 0 && tasks.filter((task) => !task.completed && !task.active).map((task, index) => (
                <Task2
                  key={task.id}
                  order={index + 1}
                  task={task}
                />
              ))}
            </TaskList>
            <AddTaskComponent />
            <hr className="my-4" />
              <TaskList>
                {tasks.length > 0 && tasks.filter((task) => task.completed).map((task) => (
                  <CompletedTask
                    key={task.id}
                    task={task}
                  />
                ))}
              </TaskList>
          </div>
        </App>
      </SortableContext>
    </DndContext>
  );
}
