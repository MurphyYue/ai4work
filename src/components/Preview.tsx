import React, { useState, useEffect, useContext } from 'react';
import { ChatbotUIContext } from '@/context';
import { LiveProvider, LiveError, LivePreview } from "react-live";
import { toast, Toaster } from 'sonner';


interface PreviewProps {}

const Preview: React.FC<PreviewProps> = () => {
  const [jsxElement, setJsxElement] = useState<string>('null');
  const { runningCode } = useContext(ChatbotUIContext);
  useEffect(() => {
    console.log('runningCode', runningCode);
    setJsxElement(runningCode);
  });
  const scope = { React, useState, useEffect, useContext, toast, Toaster };
  return (
    <div className="w-full h-full">
      <LiveProvider code={ jsxElement } scope={scope} >
        <LiveError />
        <LivePreview />
      </LiveProvider>
    </div>
  );
};

export default Preview;