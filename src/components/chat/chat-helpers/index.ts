import { v4 as uuidv4 } from "uuid";
import { ChatMessageContent } from "@/types/chat-message";
import { ChatPayload, ChatSettings } from "@/types/chat";
import { consumeReadableStream } from "@/lib/consume-stream";
import { toast } from "sonner";

import { buildFinalMessages } from "@/lib/build-prompt";
export const validateChatSettings = (messageContent: String) => {
  if (!messageContent) {
    throw new Error("Message content not found")
  }
}
export const createTempMessages = (
  messageContent: string,
  chatMessages: ChatMessageContent[],
  isRegeneration: boolean,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageContent[]>>,
) => {
  let tempUserChatMessage: ChatMessageContent = {
    message: {
      chat_id: "",
      content: messageContent,
      created_at: "",
      id: uuidv4(),
      model: 'gpt-3.5-turbo',
      role: "user",
      sequence_number: chatMessages.length,
      updated_at: "",
      user_id: ""
    }
  }

  let tempAssistantChatMessage: ChatMessageContent = {
    message: {
      chat_id: "",
      content: "",
      created_at: "",
      id: uuidv4(),
      model: 'gpt-3.5-turbo',
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      updated_at: "",
      user_id: ""
    }
  }

  let newMessages = []

  if (isRegeneration) {
    const lastMessageIndex = chatMessages.length - 1
    chatMessages[lastMessageIndex].message.content = ""
    newMessages = [...chatMessages]
  } else {
    newMessages = [
      ...chatMessages,
      tempUserChatMessage,
      tempAssistantChatMessage
    ]
  }

  setChatMessages(newMessages)

  return {
    tempUserChatMessage,
    tempAssistantChatMessage
  }
}
export const handleHostedChat = async (
  payload: ChatPayload,
  tempAssistantChatMessage: ChatMessageContent,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageContent[]>>,
) => {

  let draftMessages = await buildFinalMessages(payload)

  let formattedMessages : any[] = []
  formattedMessages = draftMessages

  const api = 'https://api2.aigcbest.top/v1/chat/completions'

  const requestBody = {
    messages: formattedMessages,
    model: payload.chatSettings.model,
    temperature: payload.chatSettings.temperature,
    max_tokens: 4096,
    stream: true
  }

  const response = await fetchChatResponse(
    api,
    requestBody,
    true,
    newAbortController,
    setIsGenerating,
    setChatMessages
  )

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    true,
    newAbortController,
    setChatMessages
  )
}

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageContent[]>>
) => {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`);
  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body)
  };
  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      toast.error(
        "Model not found. Make sure you have it downloaded via Ollama."
      )
    }

    const errorData = await response.json()

    toast.error(errorData.message)

    setIsGenerating(false)
    setChatMessages(prevMessages => prevMessages.slice(0, -2))
  }

  return response
}

export const processResponse = async (
  response: Response,
  lastChatMessage: ChatMessageContent,
  isHosted: boolean,
  controller: AbortController,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageContent[]>>,
) => {
  let fullText = ""
  let contentToAdd = ""

  if (response.body) {
    await consumeReadableStream(
      response.body,
      chunk => {

        try {
          contentToAdd = isHosted
            ? chunk
            : // Ollama's streaming endpoint returns new-line separated JSON
              // objects. A chunk may have more than one of these objects, so we
              // need to split the chunk by new-lines and handle each one
              // separately.
              chunk
                .trimEnd()
                .split("\n")
                .reduce(
                  (acc, line) => acc + JSON.parse(line).message.content,
                  ""
                )
          fullText += contentToAdd
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }

        setChatMessages(prev =>
          prev.map(chatMessage => {
            if (chatMessage.message.id === lastChatMessage.message.id) {
              const updatedChatMessage: ChatMessageContent = {
                message: {
                  ...chatMessage.message,
                  content: fullText
                }
              }

              return updatedChatMessage
            }

            return chatMessage
          })
        )
      },
      controller.signal
    )

    return fullText
  } else {
    throw new Error("Response body is null")
  }
}