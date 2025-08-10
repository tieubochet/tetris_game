import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ControlItem: React.FC<{ aKey: string; action: string; className?: string }> = ({ aKey, action, className = '' }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <kbd className="font-mono font-bold text-cyan-400 text-base w-8 h-8 flex items-center justify-center bg-gray-900 rounded-md border-b-2 border-gray-700 shadow-sm">
            {aKey}
        </kbd>
        <span className="text-gray-300">{action}</span>
    </div>
);

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
    >
      <div 
        className="bg-slate-800 rounded-lg p-6 max-w-xs w-full relative shadow-2xl border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-3xl leading-none font-light"
          aria-label="Close help"
        >
          &times;
        </button>
        <h3 id="help-title" className="font-bold text-white mb-6 text-center text-xl uppercase tracking-wider">Controls</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-md">
            <ControlItem aKey="W" action="Rotate" />
            <ControlItem aKey="D" action="Right" />
            <ControlItem aKey="A" action="Left" />
            <ControlItem aKey="S" action="Drop" />
            <ControlItem aKey="P" action="Pause" className="col-span-2 justify-center mt-2" />
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
