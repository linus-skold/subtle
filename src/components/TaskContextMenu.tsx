import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';

const TaskContextMenu = ({
  edit,
  start,
  complete,
  deleteTask,
  onClose,
  onClick,
}: {
  edit: () => void;
  start: () => void;
  complete: () => void;
  deleteTask: () => void;
  onClose?: () => void;
  onClick?: () => void;
}) => {
  const wasOpen = useRef(false);

  return (
    <Menu>
      {({ open }) => {
        useEffect(() => {
          if(wasOpen.current && !open) {
            onClose?.();
          }
          wasOpen.current = open;
        }, [open]);

        return (
          <div>
            <MenuButton>
              {' '}
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 hover:text-gray-100" onClick={onClick}/>
            </MenuButton>
            <MenuItems
              transition
              className="z-50 font-bold w-52 origin-top-right rounded-xl border border-white/5 bg-gray-900 p-2 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              anchor="bottom end"
            >
              <MenuItem>
                <a
                  className="block data-focus:bg-gray-800 px-2 py-1.5"
                  onClick={edit}
                >
                  Edit
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="block data-focus:bg-gray-800 px-2 py-1.5"
                  onClick={start}
                >
                  Start
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="block data-focus:bg-gray-800 px-2 py-1.5"
                  onClick={complete}
                >
                  Complete
                </a>
              </MenuItem>
              <hr className="border-gray-500 my-2" />
              <MenuItem>
                <div className="flex items-center space-x-2 data-focus:bg-gray-800" onClick={deleteTask}>
                  <TrashIcon className="h-5 w-5 text-red-500" />
                  <a
                    className="block data-focus:bg-gray-800 text-red-500 px-2 py-1.5"
                    href="#"
                  >
                    Delete
                  </a>
                </div>
              </MenuItem>
            </MenuItems>
          </div>
        );
      }}
    </Menu>
  );
};

export default TaskContextMenu;
