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
  const { chatMessages, setChatMessages, chatSettings, setRunningCode, isGenerating, setIsGenerating, abortController, setAbortController } =
    useContext(ChatbotUIContext);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(userInput, chatMessages, false);
    }
  };

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
      console.log("abortController", newAbortController);
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
        newAbortController,
        setIsGenerating,
        setChatMessages
      );
      // !newAbortController?.signal.aborted && console.log("generatedText", cleanUpCode(generatedText));
      !newAbortController?.signal.aborted && setRunningCode(cleanUpCode(generatedText));
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
    // then replace 'const Page = ' with empty string
    // Remove the code before 'const Page'
    // Remove the code after 'export' including 'export'
    const newstr = code?.replace(/```/g, "").replace(/jsx/g, "").replace(/"use strict";/g, "");
    const lines = newstr.split("\n");
    let start = false;
    let newLines = [];
    for (let line of lines) {
      if (line.includes("const Page")) {
        start = true;
      }
      if (line.includes("export")) {
        start = false;
      }
      if (start) {
        newLines.push(line);
      }
    }
    let newCode = newLines.join("\n");
    newCode = newCode.replace(/export/g, "").replace(/const Page = /g, "");
    return newCode;
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
