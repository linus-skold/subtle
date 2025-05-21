import React, { useState } from 'react';

interface InputComponentProps<T = unknown> {
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, value: T) => void;
  show: boolean;
}

const InputComponent = <T,>({
  placeholder,
  onKeyDown,
  show,
}: InputComponentProps<T>) => {
  const [value, setValue] = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onKeyDown?.(e, value as unknown as T);
      setValue('');
    }
  };

  if (!show) {
    return <></>;
  }

  return (
    <div className="p-[2px] subtle-gradient-shift bg-gradient-to-r from-green-400 to-blue-500 rounded-lg relative">
      <input
        type="text"
        onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? ''}
        value={value}
        className={`focus:outline-none rounded-md p-2 w-full bg-gray-800 placeholder:text-sm`}
      />
    </div>
  );
};

export default InputComponent;
