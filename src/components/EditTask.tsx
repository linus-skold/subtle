import { useTasks } from "@/context/TaskContext";
import type { Subtask } from "@/types/subtask.types";
import type { PartialTask, Task } from "@/types/task.types";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import Link from "./Link";
import SubtasksBlock from "./SubtasksBlock";

const EditTask = (props: {
  task: Task;
  open: boolean;
  onClick: (v: boolean) => void;
  onChange?: ({
    taskData,
    subtaskData,
  }: {
    taskData?: PartialTask;
    subtaskData?: Subtask[];
  }) => void;
  subtasks?: Subtask[];
}) => {
  const { open, onClick, onChange } = props;
  const [task, setTask] = useState<Task>();
  const [subtasksState, setSubtasks] = useState<Subtask[]>([]);
  const { getSubtasksByTaskId } = useTasks();
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open || wasOpen.current) return;
    if (open && props.subtasks) {
      setSubtasks(props.subtasks);
    }
    if (open && props.task) {
      setTask(props.task);
    }
    if (open && !wasOpen.current) {
      wasOpen.current = true;
    }
  }, [open, props.subtasks, props.task]);

  const onClose = () => {
    onClick(false);
    onChange?.({ subtaskData: subtasksState, taskData: task });
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
      className="fixed top-6 left-0 w-screen focus:outline-none flex min-h-full z-50"
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
          className="w-full h-32 bg-gray-800 text-white p-2 rounded-lg mt-4"
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
          subtasks={subtasksState}
          parentId={task.id}
          onSubtaskChange={() => {
            getSubtasksByTaskId(task.id)
              .then((tasks) => {
                setSubtasks(tasks);
              })
              .catch((err: unknown) => {
                console.error(err);
              });
          }}
          show={subtasksState !== null}
          expanded={true}
        />
      </DialogPanel>
    </Dialog>
  );
};
export default EditTask;
