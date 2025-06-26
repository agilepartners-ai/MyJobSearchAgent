import { CreateConversationBody, ConversationResponse } from "../types/tavus";

export const createConversation = async (
  token: string,
  conversationBody: CreateConversationBody
): Promise<ConversationResponse> => {
  // Add debug logs
  console.log('Creating conversation with body:', conversationBody);
    const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify(conversationBody),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
