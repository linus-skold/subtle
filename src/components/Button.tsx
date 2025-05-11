const Button = ({ children }) => {
  return (
    <button className="font-bold text-xl cursor-pointer self-start">
      <div className="gradient-border bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
        <div className="px-8 py-2 bg-gray-800 rounded-full flex justify">
          {children}
        </div>
      </div>
    </button>
  );
};

export default Button;
