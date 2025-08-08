import React from 'react';

interface StartButtonProps {
  callback: () => void;
  text: string;
  variant?: 'primary' | 'secondary';
  ariaLabel?: string;
}

const StartButton: React.FC<StartButtonProps> = ({ callback, text, variant = 'primary', ariaLabel }) => {
  const baseClasses = "w-full px-4 py-3 text-lg font-bold text-white rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out shadow-md";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-500 focus:ring-blue-400",
    secondary: "bg-gray-600 hover:bg-gray-500 focus:ring-gray-400"
  };

  if (text === 'Resume') {
    variantClasses.secondary = "bg-green-600 hover:bg-green-500 focus:ring-green-400";
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={callback}
      aria-label={ariaLabel || text}
    >
      {text}
    </button>
  );
};

export default StartButton;
