# My Job Search Agent 🤖

An AI-powered job search platform that automates your entire job application process. Built with Next.js, React, and TypeScript.

## 🚀 Features

### Core Capabilities

- **AI-Enhanced Job Search**: Intelligent job matching based on your skills and preferences
- **Resume Optimization**: AI-powered resume enhancement and template selection tailored to each job
- **Workday Form Parsing**: Automatically parses and understands Workday application forms (runs locally)
- **Automated Applications**: Submit applications effortlessly with AI-powered autofill (runs locally)
- **Email Reading & Auto-Update**: AI reads your emails to automatically update you on upcoming interviews and OA assignments (remote service)
- **Calendar Integration**: Connect your calendar to schedule Coffee Chats and Interviews (Technical/Behavioral)
- **AI Messaging**: Automatically writes professional messages and replies to employers on your behalf (runs locally)
- **Application Tracking**: Comprehensive dashboard to track all your applications with real-time status updates
- **Profile Management**: User profile creation and management with personalized recommendations

### Architecture

- **Online Platform**: Database tracks your application status and learns about you to provide personalized recommendations
- **Local Processing**: Workday parsing, application filling, and AI messaging run securely on your local machine
- **Remote Services**: Email reading, calendar integration, and job search run on our servers

## 📚 Documentation Index

All documentation is located in the [`docs/`](./docs/) folder:

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get up and running quickly with step-by-step setup instructions
- **[Supabase Setup](./docs/SUPABASE_SETUP.md)** - Detailed guide for setting up Supabase locally and in production
- **[Workflow Implementation](./docs/WORKFLOW_IMPLEMENTATION.md)** - Overview of the application workflow and user journey
- **[Dependency Status](./docs/DEPENDENCY_STATUS.md)** - Current status and versions of project dependencies
- **[CORS Configuration](./docs/README-CORS.md)** - CORS setup and troubleshooting guide
- **[Version Notes](./docs/VERSION_NOTES.md)** - Release notes and version history

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Phone Validation**: libphonenumber-js
- **State Management**: Redux Toolkit
- **Deployment**: Next.js (supports Vercel, Netlify, etc.)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 24 or higher)
- **npm** (version 10 or higher)
- **Git** for version control
- **Supabase CLI** (for local development) - Install via `npm install -g supabase`

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/codejedi-ai/MyJobSearchAgent.git
cd MyJobSearchAgent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with only these 3 essential variables:

```env
# Production-like Supabase Configuration
# Only these three variables are needed - matches production setup

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Get Your Local Supabase Credentials

For local development, start Supabase and get your credentials:

```bash
# Start Supabase locally
supabase start

# Get connection details (copy the values to .env.local)
supabase status
```

The output will show:
- **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
- **Publishable (anon key)** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Secret (service role key)** → Use for `SUPABASE_SERVICE_ROLE_KEY`

See [`docs/SUPABASE_SETUP.md`](./docs/SUPABASE_SETUP.md) for detailed setup instructions.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build and Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

The production server will be available at `http://localhost:3000`

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- **Netlify**: Configure build command as `npm run build` and publish directory as `.next`
- **AWS Amplify**: Follow Next.js deployment guide
- **Docker**: Use Next.js Dockerfile patterns

## 📁 Project Structure

```
MyJobSearchAgent/
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── forms/         # Form components
│   │   └── pages/         # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # External library configurations
│   ├── services/          # API and service functions
│   ├── store/             # Redux store and slices
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── supabase/              # Supabase configuration and migrations
│   ├── functions/         # Edge Functions
│   └── migrations/        # Database migrations
├── .env.local             # Environment variables (not in git)
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint -- --fix
```

## 🔄 Application Workflow

1. **Search Jobs** - AI scans thousands of job postings to find perfect matches
2. **Customize Resume** - One-click resume tailoring and cover letter generation
3. **Parse Workday Forms** - AI parses Workday application forms (local)
4. **Apply Instantly** - Automated application submission with autofill (local)
5. **Read Emails & Auto-Update** - AI reads emails and updates on interviews/OA assignments (remote)
6. **Schedule Meetups** - Calendar integration for Coffee Chats and Interviews (Technical/Behavioral)
7. **AI Message & Reply** - Automatic message writing and replies to employers (local)
8. **Track Progress** - Monitor all applications in one dashboard with real-time updates

## 🔒 Security

- **Environment Variables**: Sensitive data stored in `.env.local` (not committed to git)
- **Supabase Row Level Security (RLS)**: Configured for user data protection
- **HTTPS**: Enforced in production
- **Input Validation**: Zod schema validation throughout
- **Local Processing**: Sensitive operations (Workday parsing, application filling) run on your machine

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/codejedi-ai/MyJobSearchAgent/issues) page
2. Create a new issue with detailed description
3. Include error logs and environment details

---

**Happy Job Hunting!** 🎯
