import React from 'react';

interface StartButtonProps {
  callback: () => void;
  text: string;
  variant?: 'primary' | 'secondary';
  ariaLabel?: string;
}

const StartButton: React.FC<StartButtonProps> = ({ callback, text, variant = 'primary', ariaLabel }) => {
  const baseClasses = "w-full px-4 py-2 text-lg font-bold text-white rounded-md focus:outline-none transition-colors duration-200";
  
  const colorClasses = {
    primary: "bg-blue-600 hover:bg-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-500"
  };
  
  return (
    <button
      className={`${baseClasses} ${colorClasses[variant]}`}
      onClick={callback}
      aria-label={ariaLabel || text}
    >
      {text}
    </button>
  );
};

export default StartButton;
