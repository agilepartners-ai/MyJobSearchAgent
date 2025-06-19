import { CreateConversationBody, ConversationResponse } from "../types/tavus";

export class TavusService {
  private static readonly API_KEY = import.meta.env.VITE_TAVUS_API_KEY;

  static getApiKey(): string | null {
    return this.API_KEY || null;
  }

  static async createConversation(
    conversationBody: CreateConversationBody
  ): Promise<ConversationResponse> {
    if (!this.API_KEY) {
      throw new Error("Tavus API key not found. Please set VITE_TAVUS_API_KEY in your environment variables.");
    }

    console.log('Creating conversation with body:', conversationBody);
      const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.API_KEY,
      },
      body: JSON.stringify(conversationBody),
    });

    if (!response?.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  }
  static async endConversation(conversationId: string): Promise<void> {
    if (!this.API_KEY) {
      throw new Error("Tavus API key not found. Please set VITE_TAVUS_API_KEY in your environment variables.");
    }

    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}/end`,
      {
        method: "POST",
        headers: {
          "x-api-key": this.API_KEY,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to end conversation: ${response.status} ${errorText}`);
    }
  }
  static async getConversation(conversationId: string): Promise<ConversationResponse> {
    if (!this.API_KEY) {
      throw new Error("Tavus API key not found. Please set VITE_TAVUS_API_KEY in your environment variables.");
    }

    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": this.API_KEY,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get conversation: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;
  }
  static async listConversations(): Promise<ConversationResponse[]> {
    if (!this.API_KEY) {
      throw new Error("Tavus API key not found. Please set VITE_TAVUS_API_KEY in your environment variables.");
    }

    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "GET",
      headers: {
        "x-api-key": this.API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list conversations: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;
  }
}
