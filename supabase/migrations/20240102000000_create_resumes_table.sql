-- Create resumes table for storing resume documents as JSONB
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL, -- Complete resume document as JSON
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one active resume per user
  CONSTRAINT unique_active_resume UNIQUE (user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Create index on is_active for faster active resume queries
CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(user_id, is_active) WHERE is_active = TRUE;

-- Create GIN index on JSONB data for full-text search and queries
CREATE INDEX IF NOT EXISTS idx_resumes_data_gin ON resumes USING GIN (resume_data);

-- Create index on tags for tag-based queries
CREATE INDEX IF NOT EXISTS idx_resumes_tags ON resumes USING GIN (tags);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own resumes
CREATE POLICY "Users can view own resumes" 
  ON resumes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" 
  ON resumes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" 
  ON resumes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" 
  ON resumes FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_resumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on resume updates
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_resumes_updated_at();

-- Function to ensure only one active resume per user
CREATE OR REPLACE FUNCTION ensure_single_active_resume()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a resume as active, deactivate all other resumes for this user
  IF NEW.is_active = TRUE THEN
    UPDATE resumes 
    SET is_active = FALSE 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_active = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure only one active resume per user
CREATE TRIGGER ensure_single_active_resume_trigger
  BEFORE INSERT OR UPDATE ON resumes
  FOR EACH ROW
  WHEN (NEW.is_active = TRUE)
  EXECUTE FUNCTION ensure_single_active_resume();

-- Add helpful comments
COMMENT ON TABLE resumes IS 'Stores resume documents as JSONB objects';
COMMENT ON COLUMN resumes.resume_data IS 'Complete resume document following ResumeDocument schema';
COMMENT ON COLUMN resumes.is_active IS 'Only one resume per user can be active at a time';
COMMENT ON COLUMN resumes.version IS 'Version number for tracking resume revisions';

