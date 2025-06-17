import { useAppContext } from "../context/AppContext";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/outline";

const ActivityBar = () => {
  const { state, updateState } = useAppContext();
  

  return (
      <div className="flex justify-between">
        <div className="flex items-center">
          {/* Add dropdown for different task lists here */}
          <h1 className="text-xl font-bold">Today</h1>
        </div>
        <div className="flex space-x-4">
          <BoltIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
  );
};

export default ActivityBar;
