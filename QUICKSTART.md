# Quick Start Guide

## Prerequisites

1. **Install Supabase CLI**:
   ```bash
   # macOS
   brew install supabase/tap/supabase
   
   # Linux/Windows
   npm install -g supabase
   ```

2. **Install Docker Desktop** and make sure it's running

3. **Install Node.js** (v24 or higher)

## Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Supabase locally**:
   ```bash
   supabase start
   ```
   
   This will:
   - Download Docker images (first time only)
   - Start all Supabase services
   - Run database migrations
   - Display your connection credentials

3. **Get your local credentials**:
   ```bash
   supabase status
   ```
   
   Copy the `API URL` and `anon key` from the output.

4. **Create `.env.local` file**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key-from-status>
   NEXT_PUBLIC_AUTH_PROVIDER=supabase
   ```

5. **Start your Next.js app**:
   ```bash
   npm run dev
   ```

6. **Access Supabase Studio**:
   Open http://localhost:54323 in your browser to manage your database.

## Common Commands

```bash
# Start Supabase
supabase start

# Stop Supabase
supabase stop

# Check status and get credentials
supabase status

# Reset database (removes all data)
supabase db reset

# View logs
supabase logs
```

## Troubleshooting

- **Port conflicts**: Make sure ports 54321-54325 are available
- **Docker not running**: Start Docker Desktop first
- **Need fresh start**: Run `supabase stop --no-backup && supabase start`

For more details, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

