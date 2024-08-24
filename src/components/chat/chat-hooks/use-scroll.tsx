import { ChatbotUIContext } from "@/context";
import { useContext, useRef, useEffect } from "react";

export const useScroll = () => {
  const { isGenerating, chatMessages } = useContext(ChatbotUIContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGenerating) {
      scrollToBottom();
    }
  }, [chatMessages, isGenerating]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
      }
    }, 100)
  }
  return {
    messagesEndRef,
    scrollToBottom
  }
};