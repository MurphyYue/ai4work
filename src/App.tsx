import React from 'react';
import Chat from './components/Chat';
import Preview from './components/Preview';
import { Toaster } from 'sonner';

const App: React.FC = () => {

  return (
    <div className="flex h-screen w-screen">
      <Toaster />
      <div className="w-1/2 border-r h-full">
        <Chat />
      </div>
      <div className="w-1/2 h-full">
        <Preview />
      </div>
    </div>
  );
};

export default App;