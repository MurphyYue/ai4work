import { ChatMessageContent } from "@/types/chat-message"
import { Dispatch, SetStateAction, createContext } from "react"
import { ChatSettings } from "@/types/chat"
interface ChatbotUIContext {
  chatSettings: ChatSettings | null,
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>
  chatMessages: ChatMessageContent[],
  setChatMessages: Dispatch<SetStateAction<ChatMessageContent[]>>,
  runningCode: string,
  setRunningCode: Dispatch<SetStateAction<string>>,
  isGenerating: boolean,
  setIsGenerating: Dispatch<SetStateAction<boolean>>,
  abortController: AbortController | null
  setAbortController: Dispatch<SetStateAction<AbortController | null>>
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
}
export const ChatbotUIContext = createContext<ChatbotUIContext>({
  chatMessages: [],
  setChatMessages: () => {},
  chatSettings: null,
  setChatSettings: () => {},
  runningCode: "",
  setRunningCode: () => {},
  isGenerating: false,
  setIsGenerating: () => {},
  abortController: null,
  setAbortController: () => {},
  userInput: "",
  setUserInput: () => {},
})