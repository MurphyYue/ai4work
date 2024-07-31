import { ChatMessageContent } from "@/types/chat-message"
import { Dispatch, SetStateAction, createContext } from "react"
import { ChatSettings } from "@/types/chat"
interface ChatbotUIContext {
  chatSettings: ChatSettings | null,
  chatMessages: ChatMessageContent[],
  setChatMessages: Dispatch<SetStateAction<ChatMessageContent[]>>
}
export const ChatbotUIContext = createContext<ChatbotUIContext>({
  chatMessages: [],
  setChatMessages: () => {},
  chatSettings: null
})