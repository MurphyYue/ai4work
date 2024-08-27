import React, { useState, useEffect, useContext } from 'react';
import { ChatbotUIContext } from '@/context';
import { LiveProvider, LivePreview, withLive } from "react-live";
import { useChatHandler } from './chat/chat-hooks/use-chat-handler'; 
import { ShadcnUi } from '@/components/ui/shadcn';
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"

interface PreviewProps {}
const Preview: React.FC<PreviewProps> = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const PlaygroundError = withLive(({ live }) => {
    const { chatMessages } = useContext(ChatbotUIContext);
    const { resendMessage } = useChatHandler();
    if (!live.error) {
      return null;
    }
    setHasError(true);
    return (
      <div className='h-full w-full flex items-center justify-center flex-col'>
        <div className='text-red-500'>
          generated code has error
        </div>
        <Button onClick={() => {
          console.log(chatMessages)
          resendMessage(chatMessages);
        }}>regenerate</Button>
      </div>
    );
  });
  const [jsxElement, setJsxElement] = useState<string>('null');
  const { runningCode } = useContext(ChatbotUIContext);
  useEffect(() => {
    console.log('runningCode', runningCode);
    setJsxElement(runningCode);
  }, [runningCode]);
  const scope = { React, useState, useEffect, useContext, ...ShadcnUi };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LiveProvider code={ jsxElement } scope={scope} >
        <PlaygroundError />
        {!hasError && <LivePreview className="w-full h-screen" />}
      </LiveProvider>
      <Toaster />
    </div>
  );
};

export default Preview;