import React from 'react';
import ChatInput from './chat/chat-input'

interface ChatProps {}

const Chat: React.FC<ChatProps> = ({}) => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        
      </div>
      <div className="flex">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;