const NotesComponent = () => {
  return (
    <div className="flex flex-col flex-1 p-2">
      <h2 className="text-2xl font-bold mb-2 shrink-0">Notes</h2>
      <div className="flex-1 overflow-hidden">
        <textarea
          className="w-full h-full resize-none outline-none p-2 overflow-y-auto pr-2
            [&::-webkit-scrollbar]:w-[2px] 
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
};
export default NotesComponent;