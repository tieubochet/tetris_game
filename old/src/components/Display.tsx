import React from 'react';

interface DisplayProps {
  label: string;
  value: string | number;
}

const Display: React.FC<DisplayProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-2 bg-gray-800 rounded-md text-center">
      <p className="font-mono text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono text-xl font-bold text-white">{value}</p>
    </div>
  );
};

export default Display;
