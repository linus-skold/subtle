import { useState } from 'react';

const ToggleComponent = ({ onToggle }: { onToggle: () => void }) => {
  const [isOn, setIsOn] = useState(false);  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-96">

    </div>
  );
}

export default ToggleComponent;