# Supabase Local Development Setup

This guide will help you set up Supabase locally for development and testing using the official Supabase CLI.

## Prerequisites

- **Docker Desktop** installed and running on your machine
- **Supabase CLI** installed ([Installation Guide](https://supabase.com/docs/guides/cli/getting-started))
- **Node.js** (version 24 or higher) and npm installed

### Installing Supabase CLI

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Linux:**
```bash
# Install using npm
npm install -g supabase

# Or download the binary directly
wget -qO- https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/
```

**Windows:**
```bash
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

## Quick Start

1. **Start Supabase locally:**
   ```bash
   supabase start
   ```
   
   This command will:
   - Pull the necessary Docker images
   - Start all Supabase services (PostgreSQL, Auth, Storage, Realtime, etc.)
   - Run database migrations
   - Display connection details

2. **Get your local credentials:**
   After starting, Supabase CLI will display your local connection details:
   ```bash
   supabase status
   ```
   
   You'll see output like:
   ```
   API URL: http://localhost:54321
   GraphQL URL: http://localhost:54321/graphql/v1
   DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   Studio URL: http://localhost:54323
   Inbucket URL: http://localhost:54324
   JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Set up your environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-status>
   NEXT_PUBLIC_AUTH_PROVIDER=supabase
   ```
   
   Or use the `.env.example` file and copy the values from `supabase status`.

4. **Access Supabase Studio:**
   Open your browser and navigate to: http://localhost:54323
   
   This is the Supabase Studio interface where you can:
   - View and manage your database tables
   - Run SQL queries
   - Manage authentication
   - View API documentation
   - Test authentication flows

## Service Ports

When running locally with `supabase start`, Supabase services are available on the following ports:

- **API URL**: `http://localhost:54321`
- **PostgreSQL Database**: `localhost:54322`
- **Studio (UI)**: `http://localhost:54323`
- **Inbucket (Email Testing)**: `http://localhost:54324`
- **Kong API Gateway**: `http://localhost:54325` (internal)

## Database Setup

The database schema is automatically created when you run `supabase start` because migrations are stored in the `supabase/migrations/` directory.

### Running Migrations

Migrations are automatically applied when you run `supabase start`. If you need to create a new migration:

```bash
# Create a new migration
supabase migration new migration_name

# This creates a file in supabase/migrations/ with a timestamp
```

### Viewing Migrations

You can view all migrations:
```bash
supabase migration list
```

### Manual Migration (if needed)

If you need to manually run SQL, you can use the Supabase Studio SQL Editor at http://localhost:54323 or use the CLI:

```bash
supabase db reset  # Resets database and runs all migrations
```

## Common Commands

### Start Supabase
```bash
supabase start
```

### Stop Supabase
```bash
supabase stop
```

### Check Status
```bash
supabase status
```

### Reset Database (removes all data and re-runs migrations)
```bash
supabase db reset
```

### View Logs
```bash
supabase logs
```

### Stop and Remove All Data
```bash
supabase stop --no-backup
```

## Troubleshooting

1. **Port conflicts**: If ports are already in use, you can stop Supabase and restart:
   ```bash
   supabase stop
   supabase start
   ```

2. **Docker not running**: Make sure Docker Desktop is running before starting Supabase.

3. **Database connection issues**: Check the status:
   ```bash
   supabase status
   ```
   Make sure all services show as "healthy".

4. **Reset everything**: If you need to start fresh:
   ```bash
   supabase stop --no-backup
   supabase start
   ```

5. **View service logs**: To debug issues:
   ```bash
   supabase logs
   # Or for specific service
   supabase logs db
   supabase logs auth
   ```

6. **Update Supabase CLI**: Keep your CLI updated:
   ```bash
   # macOS
   brew upgrade supabase
   
   # npm
   npm update -g supabase
   ```

## Production Setup

For production, you'll need to:

1. **Create a Supabase project** at https://supabase.com

2. **Link your local project to remote** (optional but recommended):
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Push migrations to production**:
   ```bash
   supabase db push
   ```
   
   Or manually run migrations in the Supabase Dashboard SQL Editor.

4. **Get your production credentials**:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy your project URL and anon key

5. **Update environment variables** with production values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   NEXT_PUBLIC_AUTH_PROVIDER=supabase
   ```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase Studio](https://supabase.com/docs/guides/cli/local-development#supabase-studio)

