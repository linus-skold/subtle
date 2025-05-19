import { useTasks } from '@/context/TaskContext';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';


const EditTask = ({
  isOpen,
  onClick,
  taskId,
}: {
  isOpen: boolean;
  onClick: (v: boolean) => void;
  taskId: number;
}) => {
  
  const { getTaskById } = useTasks();
  const task = getTaskById(taskId);
  const { task_name: title, estimate } = task;

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="fixed top-6 left-0 w-screen focus:outline-none flex min-h-full "
      onClose={() => onClick(false)}
    >
      <DialogPanel transition className="
        w-full max-w-full bg-white/5 p-6 backdrop-blur-2xl 
        duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
        <div className="flex justify-between">
          <DialogTitle as="h3" className="text-base/7 font-bold text-white">
            {title}
          </DialogTitle>
          <XCircleIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors" onClick={() => onClick(false)} />
        </div>
        <textarea
          className="w-full h-32 bg-gray-800 text-white p-2 rounded-lg mt-4"
          placeholder="Edit task description"
        ></textarea>
        <div className="flex mt-4">
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)}/>
        <span className="text-gray-400 text-sm">asdwssdqwdqwdqd</span>
        </div>

      
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)} />
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)} />
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)} />
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)} />
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)} />
        <CheckBadgeIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors mt-4" onClick={() => onClick(false)} />
       

      </DialogPanel>
    </Dialog>
  );
};
export default EditTask;
