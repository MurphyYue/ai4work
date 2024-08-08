import { FC, useState } from "react";
import { ChatMessageContent } from "@/types/chat-message";
import { ChatSettings } from "@/types/chat";
import { ChatbotUIContext } from "@/context"

interface GlobalStateProps {
  children: React.ReactNode
}
const codeTemplate = `const Page = () => {return ();}; Don't export the component`;

const initCode = `
const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-black text-2xl">
      AI4Work live preview
    </div>
  );
};
    `
export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessageContent[]>([])
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gpt-3.5-turbo",
    prompt: `You are a helpful AI assistant. You can generate full code for users when they want to create a web page. The output code only based on ReactJs and in one jsx file. Here is the code template ${codeTemplate}. Delete the code at the beginning of 'export' and the code at the beginngin of 'import' `,
    temperature: 0.5,
    contextLength: 4000,
    embeddingsProvider: "openai"
  })
  const [runningCode, generateCode] = useState<string>(initCode)
  return (
    <ChatbotUIContext.Provider value={{ chatSettings, setChatSettings, chatMessages, setChatMessages, runningCode, generateCode }}>
      {children}
    </ChatbotUIContext.Provider>
  )
    
}