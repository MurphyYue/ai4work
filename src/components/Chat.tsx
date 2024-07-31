import React, { useState } from 'react';
import ChatInput from './chat/chat-input'

interface ChatProps {
  onSend: (message: string) => void;
  selectedElement: string | null;
  chatHistory: string[];
  code: string;
}

const Chat: React.FC<ChatProps> = ({ onSend, selectedElement, chatHistory, code }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    onSend(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <div key={index} className="p-2 my-2 bg-gray-200 rounded">
            {msg}
          </div>
        ))}
        <div className="p-2 my-2 bg-blue-100 rounded">
          <pre>{code}</pre>
        </div>
      </div>
      <div className="flex">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;