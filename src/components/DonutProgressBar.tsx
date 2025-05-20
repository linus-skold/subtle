import React from 'react';

const DonutProgressBar = ({ progress, size = 48, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="transform -rotate-90"
      width={size}
      height={size}
    >
      {/* Background circle */}
      <circle
        className="text-gray-300"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        className="text-green-500 transition-all duration-500"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

export default DonutProgressBar;
