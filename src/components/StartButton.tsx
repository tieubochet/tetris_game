import React from 'react';

interface StartButtonProps {
  callback: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ callback }) => {
  return (
    <button
      className="w-full px-4 py-2 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none transition-colors duration-200"
      onClick={callback}
    >
      Start Game
    </button>
  );
};

export default StartButton;