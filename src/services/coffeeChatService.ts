import { supabase } from '../lib/supabase';
import { CoffeeChat, CreateCoffeeChatData } from '../types/coffeeChat';

export class CoffeeChatService {
  static async getCoffeeChats(userId: string): Promise<CoffeeChat[]> {
    const { data, error } = await supabase
      .from('coffee_chats')
      .select('*')
      .eq('user_id', userId)
      .order('chat_date', { ascending: false, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to fetch coffee chats: ${error.message}`);
    }

    return data || [];
  }

  static async createCoffeeChat(userId: string, chatData: CreateCoffeeChatData): Promise<CoffeeChat> {
    const { data, error } = await supabase
      .from('coffee_chats')
      .insert({
        user_id: userId,
        ...chatData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create coffee chat: ${error.message}`);
    }

    return data;
  }

  static async updateCoffeeChat(userId: string, chatId: string, updates: Partial<CreateCoffeeChatData>): Promise<CoffeeChat> {
    const { data, error } = await supabase
      .from('coffee_chats')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update coffee chat: ${error.message}`);
    }

    return data;
  }

  static async deleteCoffeeChat(userId: string, chatId: string): Promise<void> {
    const { error } = await supabase
      .from('coffee_chats')
      .delete()
      .eq('id', chatId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete coffee chat: ${error.message}`);
    }
  }
}

