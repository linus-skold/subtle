import { useState } from 'react';

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Options
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Account settings
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Support
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}