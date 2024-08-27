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
      const newMessageContent = chatMessages.length !== 0 ? messageContent : messageContent + ' and use "Component" as the function name.';
      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          newMessageContent,
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
      !newAbortController?.signal.aborted && cleanUpCode(generatedText) && setRunningCode(cleanUpCode(generatedText));
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
    const len = chatMessages.length;
    const newChatMessages: ChatMessageContent[] = chatMessages.map((messageItem ,index) => {
      if (index === len - 2) {
        const newContent = messageItem.message.content;
        messageItem.message.content = newContent + ' and use "Component" as the function name.';
      }
      return messageItem;
    });
    handleSendMessage('', newChatMessages, true);
  }
  return {
    handleSendMessage,
    handleStopMessage,
    resendMessage
  }
}