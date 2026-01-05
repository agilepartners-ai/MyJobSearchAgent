export interface CoffeeChat {
  id: string;
  user_id: string;
  contact_name: string;
  contact_title?: string;
  contact_company?: string;
  contact_email?: string;
  contact_linkedin?: string;
  chat_date?: string;
  chat_type: 'coffee_chat' | 'informational' | 'networking';
  location?: string;
  notes?: string;
  follow_up_date?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  created_at: string;
  updated_at: string;
}

export interface CreateCoffeeChatData {
  contact_name: string;
  contact_title?: string;
  contact_company?: string;
  contact_email?: string;
  contact_linkedin?: string;
  chat_date?: string;
  chat_type?: 'coffee_chat' | 'informational' | 'networking';
  location?: string;
  notes?: string;
  follow_up_date?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

