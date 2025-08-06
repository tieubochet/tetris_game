import React from 'react';

interface DisplayProps {
  label: string;
  value: string | number;
}

const Display: React.FC<DisplayProps> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-md">
      <p className="font-mono text-gray-400 text-sm uppercase tracking-wider">{label}</p>
      <p className="font-mono text-lg font-bold text-white">{value}</p>
    </div>
  );
};

export default Display;