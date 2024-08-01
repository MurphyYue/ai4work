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
    model: "gpt-4-turbo-preview",
    prompt: "You are a helpful AI assistant.",
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