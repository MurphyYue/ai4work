import React, { useState } from 'react';

interface ChatProps {
  onSend: (message: string) => void;
  selectedElement: string | null;
}

const Chat: React.FC<ChatProps> = ({ onSend, selectedElement }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="w-full p-8 rounded-md bg-gray-100">
      <h1 className="text-xl font-bold mb-6">
        Streaming OpenAI API Completions in JavaScript
      </h1>
      <div id="resultContainer" className="mt-4 h-48 overflow-y-auto">
        <p className="text-gray-500 text-sm mb-2">Generated Text</p>
        <p id="resultText" className="whitespace-pre-line"></p>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 rounded-md bg-gray-200 placeholder-gray-500 focus:outline-none mt-4"
        placeholder="Enter prompt..."
      />
      <div className="flex justify-center mt-4">
        <button
          id="generateBtn"
          className="w-1/2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
          onClick={handleSend}
       >
          Generate
        </button>
        <button
          id="stopBtn"
          disabled
          className="w-1/2 px-4 py-2 rounded-md border border-gray-500 text-gray-500 hover:text-gray-700 hover:border-gray-700 focus:outline-none ml-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Chat;