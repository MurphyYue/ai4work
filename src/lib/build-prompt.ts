import { ChatPayload } from "@/types/chat"
import { ChatMessage, PayloadMessage } from "@/types/chat-message";
import { encode } from "gpt-tokenizer"

const buildBasePrompt = (
  prompt: string
) => {
  let fullPrompt = ""
  fullPrompt += `User Instructions:\n${prompt}`

  return fullPrompt
}

export async function buildFinalMessages(
  payload: ChatPayload,
) {
  const {
    chatSettings,
    chatMessages
  } = payload

  const BUILT_PROMPT = buildBasePrompt(
    chatSettings.prompt
  )

  const CHUNK_SIZE = chatSettings.contextLength
  const PROMPT_TOKENS = encode(chatSettings.prompt).length

  let remainingTokens = CHUNK_SIZE - PROMPT_TOKENS

  // let usedTokens = 0
  // usedTokens += PROMPT_TOKENS

  const processedChatMessages = chatMessages.map((chatMessage, index) => {
    const nextChatMessage = chatMessages[index + 1]

    if (nextChatMessage === undefined) {
      return chatMessage
    }

    return chatMessage
  })

  let finalMessages: PayloadMessage[] = [];

  for (let i = processedChatMessages.length - 1; i >= 0; i--) {
    const message = processedChatMessages[i].message
    const messageTokens = encode(message.content).length

    if (messageTokens <= remainingTokens) {
      remainingTokens -= messageTokens
      // usedTokens += messageTokens
      finalMessages.unshift(message)
    } else {
      break
    }
  }

  const tempSystemMessage: ChatMessage = {
    chat_id: "",
    content: BUILT_PROMPT,
    created_at: "",
    id: processedChatMessages.length + "",
    model: payload.chatSettings.model,
    role: "system",
    sequence_number: processedChatMessages.length,
    updated_at: "",
    user_id: ""
  }

  finalMessages.unshift(tempSystemMessage)

  finalMessages = finalMessages.map(message => {

    return {
      content: message.content,
      role: message.role
    };
  })

  return finalMessages
}


