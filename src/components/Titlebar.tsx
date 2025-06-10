import { XMarkIcon } from "@heroicons/react/24/outline";

export const TitlebarComponent = () => {
  return (
    <div
      data-tauri-drag-region
      className="top-0 left-0 flex justify-end items-center w-full h-6 bg-gray-800 "
    >
      <div className="absolute left-1/2 -translate-x-1/2 text-xs select-none">
        subtle
      </div>
      <div className="mx-4">
        <XMarkIcon
          className="h-5 w-5 text-gray-400 hover:text-white transition-colors"
          onClick={() => {
            // getCurrentWindow()
            //   .close()
            //   .then(() => {
            //     console.log("Window closed");
            //   })
            //   .catch((error: unknown) => {
            //     console.error("Error closing window:", error);
            //   });
          }}
        />
      </div>
    </div>
  );
};
