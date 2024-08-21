import { FC, useState } from "react";
import { ChatMessageContent } from "@/types/chat-message";
import { ChatSettings } from "@/types/chat";
import { ChatbotUIContext } from "@/context"

interface GlobalStateProps {
  children: React.ReactNode
}
const codeTemplate = `const Page = () => {return ();};
### The Function name must be 'Page'.
### Each element has an attribute named 'gen-key' and its value is an unique string.
### use taillwindcss for styling. 
### return the code with markdown formatting.
### If user didn't specify the UI style, use Google Design and dark theme.
`;

const initCode = `
const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-black text-2xl">
      AI4Work live preview
    </div>
  );
};`
export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessageContent[]>([])
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gpt-3.5-turbo",
    prompt: `You are a frontend developer. Generate a React functional component that displays what the user want to create a web page. Here is an example ${codeTemplate}.`,
    temperature: 0.5,
    contextLength: 4000,
    embeddingsProvider: "openai"
  })
  const [runningCode, generateCode] = useState<string>(initCode)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  return (
    <ChatbotUIContext.Provider value={{ chatSettings, setChatSettings, chatMessages, setChatMessages, runningCode, generateCode, isGenerating, setIsGenerating }}>
      {children}
    </ChatbotUIContext.Provider>
  )
    
}