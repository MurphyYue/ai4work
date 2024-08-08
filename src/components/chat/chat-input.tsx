import React, { useState } from "react";
import { IconPlayerStopFilled, IconSend } from "@tabler/icons-react";
import { TextareaAutosize } from "../ui/textarea-autosize";
import { cn } from "@/lib/utils";
import { validateChatSettings, createTempMessages } from "./chat-helpers";
import { ChatMessageContent } from "@/types/chat-message";
import { ChatPayload } from "@/types/chat";
import { ChatbotUIContext } from "@/context";
import { useContext } from "react";
import { handleHostedChat } from "./chat-helpers";

const ChatInput: React.FC = () => {
  const { chatMessages, setChatMessages, chatSettings, generateCode } =
    useContext(ChatbotUIContext);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(userInput, chatMessages, false);
    }
  };

  let abortController: AbortController | null = null;
  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort();
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
      abortController = new AbortController();
      validateChatSettings(messageContent);
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
        abortController,
        setIsGenerating,
        setChatMessages
      );
      console.log("generatedText", generatedText);
      generateCode(cleanUpCode(generatedText));
      setIsGenerating(false)
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setUserInput(startInput);
    }
  };
  const cleanUpCode = (code: string): string => {
    // replace '```' with empty string
    // then replace 'jsx' with empty string
    const lines = code.replace(/```/g, "").replace("jsx", "");
    return lines;
  };
  return (
    <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
      <TextareaAutosize
        className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent pr-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={"let's design an alsome web page"}
        value={userInput}
        minRows={1}
        maxRows={18}
        onValueChange={setUserInput}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
      />
      <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
        {isGenerating ? (
          <IconPlayerStopFilled
            className="hover:bg-background animate-pulse rounded bg-transparent p-1"
            onClick={handleStopMessage}
            size={30}
          />
        ) : (
          <IconSend
            className={cn(
              "bg-primary text-secondary rounded p-1",
              !userInput && "cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (!userInput) return;

              handleSendMessage(userInput, chatMessages, false);
            }}
            size={30}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
