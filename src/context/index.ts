import { ChatMessageContent } from "@/types/chat-message"
import { Dispatch, SetStateAction, createContext } from "react"
import { ChatSettings } from "@/types/chat"
interface ChatbotUIContext {
  chatSettings: ChatSettings | null,
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>
  chatMessages: ChatMessageContent[],
  setChatMessages: Dispatch<SetStateAction<ChatMessageContent[]>>,
  runningCode: string,
  generateCode: Dispatch<SetStateAction<string>>,
  isGenerating: boolean,
  setIsGenerating: Dispatch<SetStateAction<boolean>>,
}
export const ChatbotUIContext = createContext<ChatbotUIContext>({
  chatMessages: [],
  setChatMessages: () => {},
  chatSettings: null,
  setChatSettings: () => {},
  runningCode: "",
  generateCode: () => {},
  isGenerating: false,
  setIsGenerating: () => {}
})