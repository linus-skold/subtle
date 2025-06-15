const ProgressBar = ({
  progress,
  text,
}: { progress: number; text: string }) => {
  return (
    <div className="flex justify-center items-center space-x-3">
      <div className="relative flex-1 h-2 rounded-full bg-gray-800 ">
        <div
          className="absolute h-full rounded-full from-green-400 to-blue-500 bg-gradient-to-r"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm font-bold text-gray-400">{text}</div>
    </div>
  );
};

export default ProgressBar;
