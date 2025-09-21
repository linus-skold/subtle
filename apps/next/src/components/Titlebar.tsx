import { XMarkIcon } from "@heroicons/react/24/outline";

const TitlebarComponent = () => {
  return (
    <div
      className="top-0 left-0 flex justify-end items-center w-full h-6 bg-gray-800 shrink-0 z-100" 
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="fixed left-1/2 -translate-x-1/2 text-xs select-none">
        subtle
      </div>
      <div className="mx-4" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <XMarkIcon
          className="h-5 w-5 text-gray-400 hover:text-white transition-colors"
          onClick={() => { window.electronAPI.invoke("close-window", null) }}
        />
      </div>
    </div>
  );
};


export default TitlebarComponent;