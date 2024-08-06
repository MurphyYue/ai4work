import React, { useState } from 'react';
import Chat from './components/Chat';
import Preview from './components/Preview';
import { Toaster } from 'sonner';
import { ChatbotUIContext } from "@/context";
import { useContext } from 'react';

const App: React.FC = () => {
  // const { setChatSettings, chatSettings } = useContext(ChatbotUIContext);
  // setChatSettings({
  //   model: 'gpt-3.5-turbo',
  //   prompt: 'You are a friendly, helpful AI assistant. You can use React and Vue and generate full code for users when they want to create a web page',
  //   temperature: 0.5,
  //   contextLength: 1024,
  //   embeddingsProvider: "openai"
  // })
  // console.log('chatSettings', chatSettings)
  const [code, setCode] = useState<string>(`
const Page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div>
      <h1>Login Page</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
    `);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);


  const handleElementSelect = (selector: string) => {
    setSelectedElement(selector);
  };

  return (
    <div className="flex h-screen w-screen">
      <Toaster />
      <div className="w-1/2 border-r h-full">
        <Chat />
      </div>
      <div className="w-1/2 h-full">
        <Preview code={code} onElementSelect={handleElementSelect}/>
      </div>
    </div>
  );
};

export default App;