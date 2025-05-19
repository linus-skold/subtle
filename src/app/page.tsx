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
import SettingsModal from '@/components/SettingsModal';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppContext } from '@/context/AppContext';
import { useTasks } from '@/context/TaskContext';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

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
  const [ settingsOpen, setSettingsOpen ] = useState(false);

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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <App>
          {!state.isFocusMode && <TitlebarComponent />}
          {!state.isCompactMode && !state.isFocusMode && <SidebarComponent />}
          <div className="flex flex-col h-full gap-4 m-4 overflow-hidden">
            <ActivityBar />

            {activeTask && <ActiveTask />}
            <TaskList
              className="overflow-y-scroll gap-2 flex flex-col min-h-[calc(68px_*_5)] pr-2
            [&::-webkit-scrollbar]:w-[2px] 
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
              {tasks.length > 0 &&
                tasks
                  .filter((task) => !task.completed && !task.active)
                  .map((task, index) => (
                    <Task key={task.id} order={index + 1} task={task} />
                  ))}
            </TaskList>
            <AddTaskComponent className="flex flex-col gap-2">
              <div className="h-[2px] mx-12 bg-gradient-to-r from-green-400 to-blue-500 border-0 rounded-full">
                {' '}
              </div>
            </AddTaskComponent>

            <TaskList
              className="gap-2 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2"
            >
              {tasks.length > 0 &&
                tasks
                  .filter((task) => task.completed)
                  .map((task) => <CompletedTask key={task.id} task={task} />)}
            </TaskList>
          </div>

          <div className="bottom-0 left-0 w-full h-8 bg-[var(--background)] absolute items-center justify-center flex">
            hello world
          </div>

          <SettingsModal isOpen={settingsOpen} onClick={ () => { updateState({ isSettingsModalOpen: false })}} />


        </App>
      </SortableContext>
    </DndContext>
  );
}
