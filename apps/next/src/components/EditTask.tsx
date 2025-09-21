import { Dialog, DialogPanel } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { Link, SubtasksBlock } from "@/components";

import type { Subtask } from "@db/schema/subtask.schema";
import type { Task } from "@db/schema/task.schema";
import SubtaskComponent from "./SubtaskComponent";

const EditTask = (props: {
  task: Task;
  open: boolean;
  isOpen: (v: boolean) => void;
  removeSubtask: (id: number) => void;
  updateSubtask: (subtask: Subtask) => void;
  addSubtask?: (subtask: Subtask) => void;
  updateTask?: (task: Task) => void;
  subtasks?: Subtask[];
}) => {
  const { open, isOpen } = props;
  const [task, setTask] = useState<Task>();


  useEffect(() => {
    setTask(props.task);
  }, [props.task.id]);


  const onClose = () => {
    isOpen(false);
    props.updateTask?.(task);
  
  };

  const getUrlsFromText = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = text.match(urlRegex);
    return urls ?? [];
  };

  if (!task) {
    return <></>;
  }

  return (
    <Dialog
      open={open}
      as="div"
      style={{height: 'calc(100% - 24px)' }}
      className="fixed top-[24px] w-full focus:outline-none flex min-h-full z-50"
      onClose={onClose}
    >
      <DialogPanel
        transition
        className="
        w-full max-w-full bg-white/5 p-6 backdrop-blur-2xl 
        duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
      >
        <div className="flex justify-between">
          <input
            className="w-full focus:outline-hidden focus:border-green-400 border-b-2 border-gray-600"
            value={task.title}
            onChange={(e) => {
              setTask((prev) => {
                if (prev) {
                  return { ...prev, title: e.target.value };
                }
                return prev;
              });
            }}
          />
          <XCircleIcon
            className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors"
            onClick={() => onClose()}
          />
        </div>
        <textarea
          className="w-full h-32 bg-gray-800 text-white p-2 rounded-lg mt-4 outline-none"
          placeholder="Edit task description"
          value={task.description}
          onChange={(e) => {
            setTask((prev) => {
              if (prev) {
                return { ...prev, description: e.target.value };
              }
              return prev;
            });
          }}
        />
        <ul>
          {getUrlsFromText(task?.description ?? "").map((url, index) => (
            <li
              key={`url-${index}-${url}`}
              className="text-blue-400 hover:underline"
            >
              <Link href={url}>{url}</Link>
            </li>
          ))}
        </ul>

        <SubtasksBlock
          subtasks={props.subtasks}
          parentId={task.id}
          show={props.subtasks !== null}
          expanded={true}
          onAddSubtask={(subtask: Subtask) => props.addSubtask?.(subtask)}
        >
          {props.subtasks?.map((subtask) => (
            <SubtaskComponent
              key={subtask.id}
              subtask={subtask}
              onChange={(subtask: Subtask) => props.updateSubtask(subtask)}
              onRemove={(id: number) => props.removeSubtask(id)}
            />
          ))}
        </SubtasksBlock>
      </DialogPanel>
    </Dialog>
  );
};
export default EditTask;
