import { useAppContext } from "../context/AppContext";
import { Cog6ToothIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/outline";

const ICON_REGISTRY = {
  home: HomeIcon,
  settings: Cog8ToothIcon,
  bolt: BoltIcon,
} as const;

export interface ActivityBarAction {
  icon: keyof typeof ICON_REGISTRY;
  onClick: () => void;
  tooltip?: string;
}

export interface ActivityBarProps {
  actions?: ActivityBarAction[];
}

const ActivityBar = ({ actions }: ActivityBarProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        {/* Add dropdown for different task lists here */}
        <h1 className="text-xl font-bold">Today</h1>
      </div>
      <div className="flex space-x-4">
        {actions?.map((action, index) => {
          const IconComponent = ICON_REGISTRY[action.icon];

          return (
            <IconComponent
              key={index}
              className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={action.onClick}
              title={action.tooltip}
            />
          );
        })}
        {/* <BoltIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" /> */}
        {/* <Cog8ToothIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" /> */}
      </div>
    </div>
  );
};

export default ActivityBar;
