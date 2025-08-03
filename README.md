# AI Resume Builder 🚀

A modern, AI-powered resume builder built with Next.js, TypeScript, and Google Gemini AI. Create professional resumes with intelligent content suggestions and ATS optimization.

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Uses Google Gemini for smart content suggestions
- 📄 **Multiple Professional Templates** - 5 beautiful, ATS-optimized templates
- 🎯 **ATS Optimization** - AI-powered keyword optimization for job applications
- 📱 **Real-time Preview** - See changes as you build
- 📤 **Multiple Export Formats** - PDF, Word, and plain text
- 🔐 **Secure Authentication** - Built with Clerk
- 💾 **Database Storage** - PostgreSQL with Prisma ORM
- 🎨 **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI (Gemini) API key
- Clerk authentication account

### 1. Clone and Install

```bash
# Navigate to the resume directory
cd resume

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/resume_builder"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with default templates
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 🔧 Configuration

### Database Setup

1. Install PostgreSQL
2. Create database: `resume_builder`
3. Update `DATABASE_URL` in `.env.local`

### Authentication (Clerk)

1. Go to [clerk.com](https://clerk.com)
2. Create new application
3. Get your API keys
4. Add keys to `.env.local`

### AI Configuration (Google Gemini)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env.local` as `GEMINI_API_KEY`

## 📁 Project Structure

```
resume/
├── app/
│   ├── api/                    # API routes
│   │   ├── ai/                 # AI generation
│   │   ├── resumes/            # Resume CRUD
│   │   └── templates/          # Template management
│   ├── dashboard/              # Dashboard page
│   ├── resume/                 # Resume builder pages
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                     # UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── toast.tsx
│   └── hooks/                  # Custom hooks
├── lib/
│   ├── prisma.ts              # Database client
│   ├── ai.ts                  # AI client
│   ├── ai-service.ts          # AI service methods
│   └── utils.ts               # Utility functions
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts               # Database seeder
```

## 🎯 AI Features

- **Content Enhancement** - Improve existing content with AI
- **Summary Generation** - Create compelling professional summaries
- **Skill Suggestions** - AI-recommended skills based on job descriptions
- **ATS Optimization** - Optimize for applicant tracking systems
- **Job-Specific Tailoring** - Customize content for specific positions

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:generate
npm run db:push
npm run db:seed

# Linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`

## 🎨 Templates Included

1. **Modern Professional** - Clean design for tech/business roles
2. **Classic Executive** - Traditional format for senior positions
3. **Creative Portfolio** - Eye-catching design for creatives
4. **Minimalist** - Simple, content-focused design
5. **Technical Specialist** - Optimized for technical roles

## 🔐 Security

- Clerk-based authentication
- User-specific data access
- Server-side validation
- Secure API endpoints

## 📈 Roadmap

- [ ] PDF generation with puppeteer
- [ ] Advanced template variations
- [ ] Multi-user collaboration
- [ ] Resume analytics
- [ ] Mobile app
- [ ] Premium features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**
