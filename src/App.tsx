import React from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import Tetris from './components/Tetris';
import Header from './components/Header';
import { FarcasterUser } from './types';

// Define the type for the user data returned by the SDK to avoid implicit any
interface SdkUserData {
    fid: number;
    displayName?: string;
    pfpUrl?: string;
}

const App: React.FC = () => {
  const [user, setUser] = React.useState<FarcasterUser | null>(null);

  const handleSetUser = (userData: SdkUserData | null) => {
    if (userData) {
      setUser({
        fid: userData.fid,
        displayName: userData.displayName,
        pfp: userData.pfpUrl,
      });
    }
  };

  React.useEffect(() => {
    sdk.actions.ready();
    // Check for existing user data
    sdk.user.getUserInfo().then(handleSetUser).catch(console.error);
  }, []);

  const handleLogin = () => {
    // Calling getUserInfo again will prompt for login if needed
    sdk.user.getUserInfo().then(handleSetUser).catch((error) => console.error("Login failed:", error));
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
