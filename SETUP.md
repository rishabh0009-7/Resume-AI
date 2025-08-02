# AI Resume Builder - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI (Gemini) API key
- Clerk authentication account

### 1. Environment Setup

Create a `.env.local` file in the `resume` directory:

```bash
# Database
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

### 2. Install Dependencies

```bash
cd resume
npm install
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with default templates
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 🔧 Configuration Details

### Database Configuration

1. **PostgreSQL Setup**

   - Install PostgreSQL on your system
   - Create a new database: `resume_builder`
   - Update the `DATABASE_URL` in `.env.local`

2. **Prisma Configuration**
   - The schema is already configured in `prisma/schema.prisma`
   - Run `npm run db:generate` to generate the Prisma client
   - Run `npm run db:push` to sync the schema with your database

### Authentication Setup (Clerk)

1. **Create Clerk Account**

   - Go to [clerk.com](https://clerk.com)
   - Create a new application
   - Get your publishable key and secret key

2. **Configure Clerk**
   - Add your keys to `.env.local`
   - Configure allowed domains in Clerk dashboard
   - Set up sign-in methods (email, Google, etc.)

### AI Configuration (Google Gemini)

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to `.env.local` as `GEMINI_API_KEY`

## 📁 Project Structure

```
resume/
├── app/
│   ├── api/                    # API routes
│   │   ├── ai/                 # AI generation endpoints
│   │   ├── resumes/            # Resume CRUD operations
│   │   └── templates/          # Template management
│   ├── resume/                 # Resume builder pages
│   └── page.tsx               # Landing page
├── components/
│   ├── ResumeBuilder.tsx       # Main builder component
│   ├── ResumeSection.tsx       # Section editor
│   ├── ResumePreview.tsx       # Live preview
│   ├── AIPanel.tsx            # AI assistance panel
│   ├── TemplateSelector.tsx    # Template selection
│   └── ResumeExport.tsx       # Export functionality
├── lib/
│   ├── prisma.ts              # Database client
│   ├── ai.ts                  # AI client
│   └── ai-service.ts          # AI service methods
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts               # Database seeder
```

## 🎯 Key Features

### ✅ Implemented Features

- **AI-Powered Resume Building**: Uses Google Gemini for content generation
- **Multiple Templates**: 5 professional templates included
- **Real-time Preview**: Live preview as you build
- **Section Management**: Add, edit, and reorder sections
- **Export Options**: PDF, Word, and plain text formats
- **ATS Optimization**: AI-powered keyword optimization
- **User Authentication**: Secure login with Clerk
- **Database Storage**: Persistent resume storage

### 🔄 AI Capabilities

- **Content Enhancement**: Improve existing content
- **Summary Generation**: Create compelling professional summaries
- **Skill Suggestions**: AI-recommended skills based on job descriptions
- **ATS Optimization**: Optimize content for applicant tracking systems
- **Job-Specific Tailoring**: Customize content for specific positions

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables for Production

Make sure to set these in your production environment:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`

## 🛠️ Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate
npm run db:push
npm run db:seed

# Linting
npm run lint
```

## 📊 Database Schema

The app uses a comprehensive database schema with:

- **Users**: Authentication and profile data
- **Resumes**: Main resume entities
- **Resume Sections**: Modular content blocks
- **Templates**: Reusable design templates
- **AI History**: Track AI interactions

## 🔐 Security Features

- **Authentication**: Clerk-based user authentication
- **Authorization**: User-specific data access
- **Input Validation**: Server-side validation
- **Rate Limiting**: API rate limiting (implement as needed)
- **Data Encryption**: Database encryption (configure in production)

## 🎨 Customization

### Adding New Templates

1. Add template data to `prisma/seed.ts`
2. Run `npm run db:seed`
3. Templates will appear in the selector

### Custom AI Prompts

1. Modify prompts in `lib/ai-service.ts`
2. Add new AI methods as needed
3. Update API routes to handle new features

### Styling

- Uses Tailwind CSS for styling
- Customizable in `app/globals.css`
- Component-specific styles in each component

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**

   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Run `npm run db:push` to sync schema

2. **AI Generation Fails**

   - Check `GEMINI_API_KEY` is valid
   - Verify API key has proper permissions
   - Check network connectivity

3. **Authentication Issues**

   - Verify Clerk keys are correct
   - Check domain configuration in Clerk dashboard
   - Ensure environment variables are set

4. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Clear `.next` folder: `rm -rf .next`
   - Restart development server

## 📈 Next Steps

### Potential Enhancements

- **PDF Generation**: Implement proper PDF generation with puppeteer
- **Advanced Templates**: Add more template variations
- **Collaboration**: Multi-user resume editing
- **Analytics**: Track resume performance
- **Mobile App**: React Native companion app
- **Premium Features**: Advanced AI features for paid users

### Performance Optimization

- **Caching**: Implement Redis for caching
- **CDN**: Use CDN for static assets
- **Database Indexing**: Optimize database queries
- **Image Optimization**: Optimize template images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Building! 🚀**
