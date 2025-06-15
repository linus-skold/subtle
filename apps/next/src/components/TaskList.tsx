import { useDroppable } from "@dnd-kit/core";

const TaskList = ({
  children,
  className,
}: { children: React.ReactNode; className?: string; maxHeight?: string }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "task-list",
  });
  const style = {
    opacity: isOver ? 0.5 : 1,
  };

  return (
    <div
      className={`overflow-y-auto gap-2 flex flex-col  
            pr-2
            [&::-webkit-scrollbar]:w-[2px] 
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ${className}`}
      ref={setNodeRef}
      style={style}
    >
      {children}
    </div>
  );
};

export default TaskList;
