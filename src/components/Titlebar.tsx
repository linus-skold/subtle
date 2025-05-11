export const TitlebarComponent = () => {
  return (
    <div
      data-tauri-drag-region
      className="top-0 left-0 flex justify-end items-center w-full h-6 bg-gray-800 "
    >
      <div className="absolute left-1/2 -translate-x-1/2 text-xs select-none">
        subtle
      </div>
      {/* <div className="titlebar-buttons" id="buttons">
        <div className="titlebar-button " id="titlebar-minimize">
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-maximize">
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-close">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </div> */}
    </div>
  );
};
