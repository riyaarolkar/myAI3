# MyAI3 - AI Chatbot Assistant

## Overview
MyAI3 is a customizable AI chatbot assistant built with Next.js, featuring web search capabilities (via Exa API), vector database integration (Pinecone), and content moderation using OpenAI's APIs. This project was imported from GitHub and configured to run on Replit.

## Project Status
- **Last Updated**: November 26, 2025
- **Platform**: Replit
- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Language**: TypeScript
- **Port**: 5000 (frontend)

## Recent Changes
- **Nov 26, 2025**: Initial Replit environment setup
  - Configured Next.js to run on 0.0.0.0:5000 for Replit proxy compatibility
  - Updated next.config.ts to allow all origins for server actions
  - Set up Next.js Dev Server workflow
  - Installed all dependencies

## Environment Configuration

### Required Environment Variables (Not Yet Set)
The application requires the following API keys to be configured:

1. **OPENAI_API_KEY** (Required)
   - Used for: AI model responses and content moderation
   - Get from: https://platform.openai.com/api-keys
   
2. **EXA_API_KEY** (Optional)
   - Used for: Web search functionality
   - Get from: https://dashboard.exa.ai/
   
3. **FIREWORKS_API_KEY** (Optional)
   - Used for: Alternative AI models via Fireworks
   - Get from: https://fireworks.ai/
   
4. **PINECONE_API_KEY** (Optional)
   - Used for: Vector database search
   - Get from: https://app.pinecone.io/

### Setting Environment Variables
Use the Replit Secrets tab to add these API keys. The application will work with just OPENAI_API_KEY, but additional features require the optional keys.

## Project Architecture

### Key Directories
- **app/**: Next.js app router structure
  - **api/chat/**: Chat API endpoint and tool implementations
  - **parts/**: UI component parts
  - **terms/**: Terms of Use page
- **components/**: Reusable React components
  - **ai-elements/**: AI-specific UI components
  - **messages/**: Message display components
  - **ui/**: Base UI components (shadcn/ui)
- **lib/**: Utility libraries (moderation, Pinecone, sources, utils)
- **types/**: TypeScript type definitions
- **hooks/**: Custom React hooks

### Main Configuration Files
- **config.ts**: Application configuration (AI name, model, moderation messages, Pinecone settings)
- **prompts.ts**: System prompts that define AI behavior
- **next.config.ts**: Next.js configuration (configured for Replit)
- **package.json**: Dependencies and scripts

## Features
1. **AI Chat Interface**: Powered by OpenAI GPT-4.1
2. **Web Search**: Real-time web search using Exa API
3. **Vector Database Search**: Knowledge base search using Pinecone
4. **Content Moderation**: Automatic content filtering for safety
5. **Local Storage**: Chat history persisted in browser localStorage
6. **Streaming Responses**: Real-time AI response streaming
7. **Citations**: Automatic source citations for search results

## Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **AI SDK**: Vercel AI SDK with multiple provider support
- **State Management**: React hooks, local storage
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Development

### Running the Application
The application is configured to run automatically via the Next.js Dev Server workflow. It binds to:
- Host: 0.0.0.0 (allows Replit proxy)
- Port: 5000 (required for Replit webview)

### Customization Guide
For non-technical customization, edit these files:
1. **config.ts**: Change AI name, owner name, welcome message, moderation messages
2. **prompts.ts**: Modify AI behavior, tone, style, and guardrails

### Important Notes for Replit Environment
- The dev server must run on port 5000 for the webview to work
- Next.js is configured to allow all origins for server actions (required for Replit's proxy)
- Chat history is stored in browser localStorage (no database needed)

## User Preferences
(None documented yet)

## Known Issues
- Environment variables need to be set up before full functionality is available
- Application requires OPENAI_API_KEY at minimum to function

## Deployment
The project is configured for Vercel deployment, but can be deployed to other platforms. For production deployment:
1. Set environment variables in deployment platform
2. Run `npm run build`
3. Run `npm run start`

## Links
- Original deployment documentation mentions Vercel
- API documentation: See AGENTS.md in project root
