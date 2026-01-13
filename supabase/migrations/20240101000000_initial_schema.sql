-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  skills TEXT[],
  resume_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_applied',
  application_date TIMESTAMPTZ NOT NULL,
  last_updated TIMESTAMPTZ,
  location TEXT,
  job_posting_url TEXT,
  job_description TEXT,
  notes TEXT,
  resume_url TEXT,
  cover_letter_url TEXT,
  salary_range TEXT,
  employment_type TEXT,
  remote_option BOOLEAN DEFAULT FALSE,
  contact_person TEXT,
  contact_email TEXT,
  interview_date TIMESTAMPTZ,
  response_date TIMESTAMPTZ,
  follow_up_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 1,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Preferences table
CREATE TABLE IF NOT EXISTS job_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  job_titles TEXT[],
  locations TEXT[],
  salary_expectation NUMERIC,
  employment_types TEXT[],
  remote_only BOOLEAN DEFAULT FALSE,
  skills TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Experience table
CREATE TABLE IF NOT EXISTS work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON job_applications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON job_preferences FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own preferences" ON job_preferences FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own preferences" ON job_preferences FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own work experience" ON work_experience FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own work experience" ON work_experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work experience" ON work_experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own work experience" ON work_experience FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own education" ON education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own education" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON education FOR DELETE USING (auth.uid() = user_id);

