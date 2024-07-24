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
    <div className="p-4">
      <div className="mb-4">Chat with AI</div>
      {selectedElement && (
        <div className="mb-2 text-blue-500">
          Selected Element: {selectedElement}
        </div>
      )}
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;