-- Add interview stages column to job_applications
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS interview_stages JSONB DEFAULT '[]'::jsonb;

-- Add current_stage column to track which stage the application is in
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS current_stage TEXT;

-- Coffee Chats table
CREATE TABLE IF NOT EXISTS coffee_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_title TEXT,
  contact_company TEXT,
  contact_email TEXT,
  contact_linkedin TEXT,
  chat_date TIMESTAMPTZ,
  chat_type TEXT DEFAULT 'coffee_chat', -- coffee_chat, informational, networking
  location TEXT,
  notes TEXT,
  follow_up_date TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for coffee_chats
ALTER TABLE coffee_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for coffee_chats
CREATE POLICY "Users can view own coffee chats" ON coffee_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee chats" ON coffee_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee chats" ON coffee_chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee chats" ON coffee_chats FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_coffee_chats_user_id ON coffee_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_chats_chat_date ON coffee_chats(chat_date);

