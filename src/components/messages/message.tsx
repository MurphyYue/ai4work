import React from "react";
import { ChatMessage } from "@/types/chat-message";
import { ChatbotUIContext } from "@/context";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import {
  IconBolt,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconCircleFilled,
  IconFileText,
  IconMoodSmile,
  IconPencil,
} from "@tabler/icons-react";
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MessageMarkdown } from "./message-markdown"

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
          {message.role === "system" ? (
            <div className="flex items-center space-x-4">
              <IconPencil
                className="border-primary bg-primary text-secondary rounded border-DEFAULT p-1"
                size={24}
              />

              <div className="text-lg font-semibold">Prompt</div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <IconMoodSmile
                className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
                size={24}
              />
            </div>
          )}
          <MessageMarkdown content={message.content} />
        </div>
      </div>
    </div>
  );
};

export default Message;
