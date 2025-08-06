import React from 'react';

interface DisplayProps {
  gameOver?: boolean;
  text: string;
}

const Display: React.FC<DisplayProps> = ({ gameOver, text }) => {
  const textColor = gameOver ? 'text-red-500' : 'text-gray-300';
  return (
    <div className={`flex items-center justify-start w-full px-4 py-2 mb-2 border-4 border-gray-700 rounded-md bg-gray-900 ${textColor}`}>
      <p className="font-mono text-lg">{text}</p>
    </div>
  );
};

export default Display;
