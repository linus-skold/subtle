import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Fragment } from 'react';

const TaskContextMenu = () => {
  return (
    <Menu>
      <MenuButton>
        {' '}
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 hover:text-gray-100" />
      </MenuButton>
      <MenuItems
        transition
        className="font-bold w-52 origin-top-right rounded-xl border border-white/5 bg-gray-900 p-2 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        anchor="bottom end"
      >
        <MenuItem>
          <a
            className="block data-focus:bg-gray-800 px-2 py-1.5"
            href="/settings"
          >
            Edit
          </a>
        </MenuItem>
        <MenuItem>
          <a
            className="block data-focus:bg-gray-800 px-2 py-1.5"
            href="/settings"
          >
            Start
          </a>
        </MenuItem>
        <MenuItem>
          <a
            className="block data-focus:bg-gray-800 px-2 py-1.5"
            href="/support"
          >
            Complete
          </a>
        </MenuItem>
        <hr className="border-gray-500 my-2" />
        <MenuItem>
          <div className="flex items-center space-x-2">
            <TrashIcon className="h-5 w-5 text-red-500" />
            <a
              className="block data-focus:bg-gray-800 text-red-500 px-2 py-1.5"
              href="#"
              onClick={() => console.log('Delete clicked')}
            >
              Delete
            </a>
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default TaskContextMenu;
