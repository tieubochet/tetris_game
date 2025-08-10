import React from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import Tetris from './components/Tetris';
import Header from './components/Header';
import { FarcasterUser } from './types';

const App: React.FC = () => {
  const [user, setUser] = React.useState<FarcasterUser | null>(null);

  React.useEffect(() => {
    // Check for existing user data
    sdk.getFarcasterUser().then(userData => {
      if (userData) {
        setUser({
          fid: userData.fid,
          displayName: userData.displayName,
          pfp: userData.pfpUrl
        });
      }
    }).catch(console.error);
  }, []);

  const handleLogin = async () => {
    try {
      const userData = await sdk.getFarcasterUser();
      if (userData) {
        setUser({
          fid: userData.fid,
          displayName: userData.displayName,
          pfp: userData.pfpUrl
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-[424px] h-[685px] bg-gray-900 text-white font-mono flex flex-col items-center p-2 rounded-lg shadow-2xl overflow-hidden">
        <Header user={user} onLogin={handleLogin} />
        <Tetris user={user} />
      </div>
    </div>
  );
};

export default App;
