

const SettingsModal = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="top-12 left-12  absolute z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        
        
        {children}
      </div>
    </div>
  );
}
export default SettingsModal;