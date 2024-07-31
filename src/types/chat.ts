import { ChatMessageContent } from "./chat-message"
export interface ChatSettings {
  model: string
  prompt: string
  temperature: number
  contextLength: number
  embeddingsProvider: "openai" | "local"
}

export interface ChatPayload {
  chatSettings: ChatSettings
  chatMessages: ChatMessageContent[]
}