import React from "react";
import { ChatMessage } from "@/types/chat-message";
import { cn } from "@/lib/utils";
import { IconMoodSmile } from "@tabler/icons-react";
import { MessageMarkdown } from "./message-markdown"
import { OpenAISVG } from "@/assets/openai-svg"

interface MessageProps {
  message: ChatMessage;
  isLast: boolean;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={cn(
        "flex w-full justify-center",
        message.role === "user" ? "" : "bg-secondary"
      )}
    >
      <div className="relative flex w-full flex-col p-6">
        <div className="space-y-3">
          {message.role === "assistant" ? (
            <div className="flex items-center space-x-4">
              <OpenAISVG
                className="border-primary bg-primary text-secondary rounded border-DEFAULT p-1"
              />
              <div className="text-lg font-semibold">chatbot</div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <IconMoodSmile
                className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
                size={48}
              />
              <div className="text-lg font-semibold">user</div>
            </div>
          )}
          <MessageMarkdown content={message.content} />
        </div>
      </div>
    </div>
  );
};

export default Message;
