import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { CheckCircleIcon as CheckCircleIconOutline } from "@heroicons/react/24/outline";

export const CheckCircle = ({ filled = false }: { filled?: boolean }) => {
  if (!filled) {
    return <CheckCircleIconOutline className="h-4 w-4 hover:text-green-600" />;
  }
  return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
};
