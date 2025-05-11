import { useDroppable } from '@dnd-kit/core';

const TaskList = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'task-list',
  });
  const style = {
    opacity: isOver ? 0.5 : 1,
  };

  return (
    <div className={`task-list ${className}`} ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default TaskList;
