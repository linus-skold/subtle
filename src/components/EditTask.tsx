import { useTasks } from '@/context/TaskContext';
import { Subtask } from '@/types/subtask.types';
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SubtasksBlock from './SubtasksBlock';
import { PartialTask } from '@/types/task.types';

const EditTask = (props: {
  task: PartialTask;
  isOpen: boolean;
  onClick: (v: boolean) => void;
  onChange?: ({taskData, subtaskData}:{taskData?: PartialTask, subtaskData?: Subtask[]}) => void;
  subtasks?: Subtask[];
}) => {
  const { isOpen, onClick, onChange, task } = props;

  const { getSubtasksByTaskId } = useTasks();

  const { title, estimate } = task;
  const [ subtasksState, setSubtasks ] = useState<Subtask[]>([]);

  const [ taskName, setTaskName ] = useState<string>(title);

  useEffect(() => {
    if (isOpen && props.subtasks) {
      setSubtasks(props.subtasks);
    }
  }
  , [isOpen, props.subtasks]);


  const onClose = () => {
        onClick(false)
        onChange?.({ subtaskData: subtasksState });
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="fixed top-6 left-0 w-screen focus:outline-none flex min-h-full z-50"
      onClose={() => onClose()}
    >
      <DialogPanel transition className="
        w-full max-w-full bg-white/5 p-6 backdrop-blur-2xl 
        duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
        <div className="flex justify-between">
          <input value={taskName} onChange={(e) => {
            setTaskName(e.target.value);
            onChange?.({ taskData: { title: e.target.value } });
          }} />
          <XCircleIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors" onClick={() => onClose()} />
        </div>
        <textarea
          className="w-full h-32 bg-gray-800 text-white p-2 rounded-lg mt-4"
          placeholder="Edit task description"
        ></textarea>

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
