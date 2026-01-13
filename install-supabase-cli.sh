#!/bin/bash
# Install Supabase CLI for Linux
echo "Installing Supabase CLI..."
cd /tmp
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz -o supabase.tar.gz
tar -xz -f supabase.tar.gz
sudo mv supabase /usr/local/bin/
supabase --version
echo "Supabase CLI installed! Now run: supabase start"
