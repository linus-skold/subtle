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

import * as dbHelper from '@/utils/database.utils';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const taskContext = useTasks();
  const { tasks, setTasks, activeTask } = taskContext;
  const [ settingsOpen, setSettingsOpen ] = useState(false);
  const [ isStartup, setIsStartup ] = useState(true);

  useEffect(() => {
    const startup = async () => {
      try { 
        await dbHelper.sqlite.setDatabase();
        await dbHelper.task.createTable();
        await dbHelper.subtask.createSubtaskTable();
        await dbHelper.taskList.createListTable();
        await taskContext.onStartup();
        setIsStartup(false);

      } catch (error) {
        console.error('Error during database initialization:', error);
      }
    }

    if (isStartup) {
      startup();
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

  if( isStartup ) {
    return (
    <div className='flex items-center justify-center h-screen'>
      <LoadingSpinner />
    </div>
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <App>
          {!state.isFocusMode && <TitlebarComponent />}
          {!state.isCompactMode && !state.isFocusMode && <SidebarComponent />}
          <div className="flex flex-col h-full gap-4 m-4 ">
            <ActivityBar />

            {activeTask && <ActiveTask />}
            <TaskList maxHeight="50vh">
              {tasks.length > 0 &&
                tasks
                  .filter((task) => !task.completed && !task.active)
                  .map((task, index) => (
                    <Task
                      key={task.id}
                      order={index + 1}
                      task={task}
                      taskId={task.id}
                    />
                  ))}
            </TaskList>
            <AddTaskComponent className="flex flex-col gap-2">
              <div className="h-[2px] mx-12 bg-gradient-to-r from-green-400 to-blue-500 border-0 rounded-full" />
            </AddTaskComponent>

            <TaskList maxHeight="50vh">
              {tasks.length > 0 &&
                tasks
                  .filter((task) => task.completed)
                  .map((task) => <CompletedTask key={task.id} task={task} />)}
            </TaskList>
            <div className="bottom-0 left-0 w-full h-8 bg-[var(--background)] absolute items-center justify-center flex">
              <p className="text-sm">Just a simple task manager</p>
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
