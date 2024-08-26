import { useContext } from 'react';
import { ChatbotUIContext } from '@/context';
import { validateChatSettings, createTempMessages, handleHostedChat } from "../chat-helpers";
import { ChatMessageContent } from "@/types/chat-message";
import { ChatPayload } from "@/types/chat";
import { cleanUpCode } from "@/lib/utils";

export const useChatHandler = () => {
  const { setChatMessages, chatSettings, setRunningCode, setIsGenerating, abortController, setAbortController, setUserInput } = useContext(ChatbotUIContext);
  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
    }
  };
  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessageContent[],
    isRegeneration: boolean
  ) => {
    const startInput = messageContent;
    try {
      setUserInput("");
      setIsGenerating(true);
      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      !isRegeneration && validateChatSettings(messageContent);
      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          isRegeneration, // isRegeneration defalut value
          setChatMessages
        );
      let payload: ChatPayload = {
        chatSettings: chatSettings!,
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
      };
      console.log("payload", payload);
      const generatedText = await handleHostedChat(
        payload,
        tempAssistantChatMessage,
        isRegeneration,
        newAbortController,
        setIsGenerating,
        setChatMessages
      );
      !newAbortController?.signal.aborted && setRunningCode(cleanUpCode(generatedText));
      setIsGenerating(false)
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setUserInput(startInput);
    }
  };
  const resendMessage = async (
    chatMessages: ChatMessageContent[],
  ) => {
    handleSendMessage('', chatMessages, true);
  }
  return {
    handleSendMessage,
    handleStopMessage,
    resendMessage
  }
}