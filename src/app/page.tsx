'use client';
import React, { useEffect, useState, useLayoutEffect } from 'react';


import AddTaskComponent from '@/components/AddTask';
import { SidebarComponent } from '@/components/Sidebar';
import { TitlebarComponent } from '@/components/Titlebar';
import { App } from '@/components/App';
import TaskList from '@/components/TaskList';
import Task from '@/components/Task';
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
        <App >
          {!state.isFocusMode && <TitlebarComponent />}
          {!state.isCompactMode && !state.isFocusMode && <SidebarComponent />}
          <div className="m-2 flex flex-col h-full">
            <ActivityBar />

            { activeTask && <ActiveTask /> }
            <TaskList className="overflow-y-scroll max-h-[calc(380px)] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 z-20">
              {tasks.length > 0 && tasks.filter((task) => !task.completed && !task.active).map((task, index) => (
                <Task
                  key={task.id}
                  order={index + 1}
                  task={task}
                />
              ))}
            </TaskList>
            <AddTaskComponent className='mx-4 my-4' />
            <hr className="h-[1px] my-4 mx-12 bg-gradient-to-r from-green-400 to-blue-500 border-0 rounded-full" />
              <div className="max-h-[calc(280px)] flex w-full">
              <TaskList className="overflow-y-scroll w-full [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                {tasks.length > 0 && tasks.filter((task) => task.completed).map((task) => (
                  <CompletedTask
                    key={task.id}
                    task={task}
                  />
                ))}
              </TaskList>
              </div>
          </div>
        </App>
      </SortableContext>
    </DndContext>
  );
}
