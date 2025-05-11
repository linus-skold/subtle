

export const SidebarComponent = () => {
  return (
    <aside className="top-0 left-0 flex flex-col w-64 bg-gray-100 border-r h-full border-gray-300">
      <div className="flex flex-col p-4">
        <button className="mb-2 text-gray-700 hover:bg-gray-200 rounded-md p-2">
          Option 1
        </button>
        <button className="mb-2 text-gray-700 hover:bg-gray-200 rounded-md p-2">
          Option 2
        </button>
        <button className="mb-2 text-gray-700 hover:bg-gray-200 rounded-md p-2">
          Option 3
        </button>
        <button className="mb-2 text-gray-700 hover:bg-gray-200 rounded-md p-2">
          Option 4
        </button>
        </div>
    </aside>
  );
};