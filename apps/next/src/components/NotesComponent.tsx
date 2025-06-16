const { useState } = require("react");

const NotesComponent = () => {

  const [ notes, setNotes ] = useState<string>("");


  const parseText = (text: string): React.ReactNode => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <strong key={index}>{line.slice(2, -2)}</strong>;
      } else if (line.startsWith("*") && line.endsWith("*")) {
        return <em key={index}>{line.slice(1, -1)}</em>;
      } else if (line.startsWith("`") && line.endsWith("`")) {
        return <code key={index}>{line.slice(1, -1)}</code>;
      } else {
        return <span key={index}>{line}</span>;
      }
    }
    );
  };


  return (
    <div className="flex flex-col flex-1 p-2">
      <h2 className="text-2xl font-bold mb-2 shrink-0">Notes</h2>
      <div className="flex-1 overflow-hidden">
        <div className="relative p-2">
          <div className="absolute">
            {parseText(notes)}
          </div>
        <textarea
          className="w-full h-full resize-none outline-none overflow-y-auto pr-2 relative
            [&::-webkit-scrollbar]:w-[2px] 
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          spellCheck="false"
        />
        </div>
      </div>
    </div>
  );
};
export default NotesComponent;