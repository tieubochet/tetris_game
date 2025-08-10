import React from 'react';

interface StartButtonProps {
  callback: () => void;
  text: string;
  variant?: 'primary' | 'secondary' | 'success';
  ariaLabel?: string;
}

const StartButton: React.FC<StartButtonProps> = ({ callback, text, variant = 'primary', ariaLabel }) => {
  const baseClasses = "w-full px-4 py-3 text-lg font-bold text-white rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out shadow-md";
  
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return "bg-blue-600 hover:bg-blue-500 focus:ring-blue-400";
      case 'success':
        return "bg-green-600 hover:bg-green-500 focus:ring-green-400";
      case 'secondary':
      default:
        return "bg-gray-600 hover:bg-gray-500 focus:ring-gray-400";
    }
  };
  
  return (
    <button
      className={`${baseClasses} ${getVariantClass()}`}
      onClick={callback}
      aria-label={ariaLabel || text}
    >
      {text}
    </button>
  );
};

export default StartButton;
