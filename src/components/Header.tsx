import React from 'react';
import { FarcasterUser } from '../types';

interface HeaderProps {
  user: FarcasterUser | null;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin }) => {
  return (
    <header className="w-full flex justify-between items-center p-2 mb-2 flex-shrink-0">
      <h1 className="text-4xl font-bold tracking-widest">TETRIS</h1>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate max-w-28">{user.displayName}</span>
          {user.pfp && <img src={user.pfp} alt="User PFP" className="w-10 h-10 rounded-full" />}
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;