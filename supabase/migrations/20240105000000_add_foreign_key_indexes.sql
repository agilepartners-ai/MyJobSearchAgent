-- Add indexes on foreign key columns for better query performance
-- Foreign keys are frequently used in JOINs and WHERE clauses, so indexing them improves performance

-- Index on job_applications.user_id (foreign key to auth.users)
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);

-- Index on work_experience.user_id (foreign key to auth.users)
CREATE INDEX IF NOT EXISTS idx_work_experience_user_id ON work_experience(user_id);

-- Index on education.user_id (foreign key to auth.users)
CREATE INDEX IF NOT EXISTS idx_education_user_id ON education(user_id);

-- Note: The following indexes already exist but are marked as unused (likely because tables are empty):
-- - idx_resumes_user_id (will be used when resumes are queried by user)
-- - idx_resumes_is_active (will be used when querying active resumes)
-- - idx_resumes_data_gin (will be used for JSONB queries)
-- - idx_resumes_tags (will be used for tag-based queries)
-- - idx_coffee_chats_user_id (will be used when querying coffee chats by user)
-- - idx_coffee_chats_chat_date (will be used when filtering by date)
-- These are kept as they will be beneficial once data is added to the tables.

