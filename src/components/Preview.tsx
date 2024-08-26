import React, { useState, useEffect, useContext } from 'react';
import { ChatbotUIContext } from '@/context';
import { LiveProvider, LivePreview, withLive } from "react-live";
import { toast, Toaster } from 'sonner';
import { useChatHandler } from './chat/chat-hooks/use-chat-handler'; 

const PlaygroundError = withLive(({ live }) => {
  const { chatMessages } = useContext(ChatbotUIContext);
  const { resendMessage } = useChatHandler();
  if (!live.error) {
    return null;
  }
  return (
    <div className='h-full w-full flex items-center justify-center flex-col'>
      <div className='text-red-500'>
        generated code has error
      </div>
      <button onClick={() => {
        console.log(chatMessages)
              resendMessage(chatMessages);
            }}>regenerate</button>
    </div>
  );
});

interface PreviewProps {}
const Preview: React.FC<PreviewProps> = () => {
  const [jsxElement, setJsxElement] = useState<string>('null');
  const { runningCode } = useContext(ChatbotUIContext);
  useEffect(() => {
    console.log('runningCode', runningCode);
    setJsxElement(runningCode);
  }, [runningCode]);
  const scope = { React, useState, useEffect, useContext, toast, Toaster };
  return (
    <div className="w-full h-full">
      <LiveProvider code={ jsxElement } scope={scope} >
        <PlaygroundError />
        <LivePreview />
      </LiveProvider>
    </div>
  );
};

export default Preview;