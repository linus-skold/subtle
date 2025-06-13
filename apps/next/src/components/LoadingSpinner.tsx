import React from "react";

const LoadingSpinner = () => {
  const strokeWidth = 5;
  const size = 48;
  const progress = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center animate-spin">
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2b7fff" />
            <stop offset="100%" stopColor="#05df72" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          className="text-gray-900"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-green-400 border border-green-100 transition-all duration-500"
          stroke="url(#grad)"
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
    </div>
  );
};

export default LoadingSpinner;
