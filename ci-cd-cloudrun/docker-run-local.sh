#!/bin/bash

# Docker Local Run Script with Environment Variables
# This script builds and runs the Docker container with proper environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building and running Docker container locally...${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create a .env file with the following variables:"
    echo ""
    echo "# Required API Keys"
    echo "OPENAI_API_KEY=your-openai-api-key-here"
    echo ""
    echo "# Supabase Configuration (Local)"
    echo "NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    echo "NEXT_PUBLIC_AUTH_PROVIDER=supabase"
    echo ""
    echo "# JSearch API"
    echo "NEXT_PUBLIC_JSEARCH_API_KEY=dfa377a0fbmsh8df80548e982bc2p1300b3jsnd59691bcf380"
    echo "NEXT_PUBLIC_JSEARCH_API_HOST=jsearch.p.rapidapi.com"
    echo ""
    echo "# Next.js Environment"
    echo "NODE_ENV=production"
    echo "PORT=8080"
    exit 1
fi

# Source the .env file to get variables
source .env

# Build the Docker image with environment variables from .env file
echo "Building Docker image with environment variables..."
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_AUTH_PROVIDER="$NEXT_PUBLIC_AUTH_PROVIDER" \
  --build-arg NEXT_PUBLIC_JSEARCH_API_KEY="$NEXT_PUBLIC_JSEARCH_API_KEY" \
  --build-arg NEXT_PUBLIC_JSEARCH_API_HOST="$NEXT_PUBLIC_JSEARCH_API_HOST" \
  --build-arg NEXT_PUBLIC_RESUME_API_BASE_URL="$NEXT_PUBLIC_RESUME_API_BASE_URL" \
  --build-arg NEXT_PUBLIC_RESUME_API_MODEL_TYPE="$NEXT_PUBLIC_RESUME_API_MODEL_TYPE" \
  --build-arg NEXT_PUBLIC_RESUME_API_MODEL="$NEXT_PUBLIC_RESUME_API_MODEL" \
  --build-arg NEXT_PUBLIC_OPENAI_API_KEY="$NEXT_PUBLIC_OPENAI_API_KEY" \
  -t myjobsearchagent-local \
  -f ci-cd-cloudrun/Dockerfile .

# Run the container with environment variables
echo -e "${YELLOW}Running Docker container...${NC}"
docker run -p 8080:8080 --env-file .env myjobsearchagent-local

echo -e "${GREEN}Container is running at http://localhost:8080${NC}"
