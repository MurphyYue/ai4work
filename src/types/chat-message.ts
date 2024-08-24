export interface ChatMessageContent {
  message: ChatMessage;
}

export interface ChatMessage {
  chat_id: string;
  content: string;
  created_at: string;
  id: string;
  model: string;
  role: string;
  sequence_number: number;
  updated_at: string | null;
  user_id: string;
}

export interface PayloadMessage {
  role: string;
  content: string;
}