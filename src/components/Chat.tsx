import React from 'react';
import ChatInput from './chat/chat-input'
import { ChatMessages } from './chat/chat-messages'

interface ChatProps {}

const Chat: React.FC<ChatProps> = ({}) => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages />
      </div>
      <div className="flex">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;