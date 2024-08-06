import { FC, useState } from "react";
import { ChatMessageContent } from "@/types/chat-message";
import { ChatSettings } from "@/types/chat";
import { ChatbotUIContext } from "@/context"

interface GlobalStateProps {
  children: React.ReactNode
}
export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessageContent[]>([])
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gpt-3.5-turbo",
    prompt: "You are a helpful AI assistant. You can generate full code for users when they want to create a web page only based on ReactJs. If users didn't clearly speak the web page content, you can use the default content 'Welcome to the live preview' and what users said.",
    temperature: 0.5,
    contextLength: 4000,
    embeddingsProvider: "openai"
  })
  return (
    <ChatbotUIContext.Provider value={{ chatSettings, setChatSettings, chatMessages, setChatMessages }}>
      {children}
    </ChatbotUIContext.Provider>
  )
    
}