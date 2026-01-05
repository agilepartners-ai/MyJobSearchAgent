-- Optimize RLS policies for better performance
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row
-- See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- Drop and recreate users table policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

CREATE POLICY "Users can view own data" ON users FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Drop and recreate job_applications table policies
DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON job_applications;

CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own applications" ON job_applications FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own applications" ON job_applications FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop and recreate job_preferences table policies
DROP POLICY IF EXISTS "Users can view own preferences" ON job_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON job_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON job_preferences;

CREATE POLICY "Users can view own preferences" ON job_preferences FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own preferences" ON job_preferences FOR UPDATE USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert own preferences" ON job_preferences FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Drop and recreate work_experience table policies
DROP POLICY IF EXISTS "Users can view own work experience" ON work_experience;
DROP POLICY IF EXISTS "Users can insert own work experience" ON work_experience;
DROP POLICY IF EXISTS "Users can update own work experience" ON work_experience;
DROP POLICY IF EXISTS "Users can delete own work experience" ON work_experience;

CREATE POLICY "Users can view own work experience" ON work_experience FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own work experience" ON work_experience FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own work experience" ON work_experience FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own work experience" ON work_experience FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop and recreate education table policies
DROP POLICY IF EXISTS "Users can view own education" ON education;
DROP POLICY IF EXISTS "Users can insert own education" ON education;
DROP POLICY IF EXISTS "Users can update own education" ON education;
DROP POLICY IF EXISTS "Users can delete own education" ON education;

CREATE POLICY "Users can view own education" ON education FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own education" ON education FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own education" ON education FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own education" ON education FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop and recreate resumes table policies
DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can insert own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;

CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING ((select auth.uid()) = user_id);

-- Drop and recreate coffee_chats table policies
DROP POLICY IF EXISTS "Users can view own coffee chats" ON coffee_chats;
DROP POLICY IF EXISTS "Users can insert own coffee chats" ON coffee_chats;
DROP POLICY IF EXISTS "Users can update own coffee chats" ON coffee_chats;
DROP POLICY IF EXISTS "Users can delete own coffee chats" ON coffee_chats;

CREATE POLICY "Users can view own coffee chats" ON coffee_chats FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own coffee chats" ON coffee_chats FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own coffee chats" ON coffee_chats FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own coffee chats" ON coffee_chats FOR DELETE USING ((select auth.uid()) = user_id);

