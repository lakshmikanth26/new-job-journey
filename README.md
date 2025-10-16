# 🧭 Career Compass

**Career Compass** is an AI-powered learning tracker web app designed to help you track your 30-day roadmap for preparing for Walmart Global Tech and SAP Labs interviews.

## 📸 Features

### 🎯 Core Features
- **Dashboard**: View current day, today's tasks, and overall progress
- **Daily Task List**: Complete tasks from your predefined 30-day roadmap
- **Revision Hub**: Review and mark completed tasks as revised
- **Programs Tracker**: Track coding problems from LeetCode, GeeksforGeeks, etc.
- **SAP Projects**: Manage your SAP BTP and other project work
- **Reference Links**: Add quick reference links to tasks for easy recall
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Progress Tracking**: Visual progress bars and completion statistics

### 💾 Data Persistence
- **Supabase (PostgreSQL)**: Store data in cloud database (optional)
- **localStorage Fallback**: Works offline with browser storage if Supabase is not configured

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (optional - falls back to localStorage)
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd new-job-journey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Your `.env` file is already configured with Supabase! ✅
   
   To use it, just run the SQL schema:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Open SQL Editor
   - Copy contents from `lib/supabase-schema.sql`
   - Run the query
   
   See `SUPABASE_SETUP.md` for detailed instructions.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Usage

### Dashboard
The dashboard shows:
- Current day of your 30-day journey
- Today's tasks with completion checkboxes
- Progress statistics
- Overall completion percentage

### Daily Tasks
View all 30 days of tasks:
- Expand/collapse days
- Mark tasks as complete
- Add reference links for quick recall

### Revision
Review your completed tasks:
- Filter by category
- Search for specific topics
- Mark tasks as "Revised" for spaced repetition

### Programs
Track your coding practice:
- Add LeetCode/GFG problems
- Track difficulty and status
- Add notes for each problem

### SAP Projects
Manage your project portfolio:
- Add project details
- Link to GitHub repos
- Link to deployed applications
- Track technologies used

## 📅 30-Day Roadmap

The app comes pre-loaded with a comprehensive 30-day interview preparation plan covering:

- **DSA**: Arrays, Strings, Trees, Dynamic Programming, etc.
- **Java**: OOP, Collections, Streams, CompletableFuture
- **Spring Boot**: REST APIs, Microservices, Feign Client
- **SAP BTP**: CAP Framework, HANA, UI5/Fiori, Integration Suite
- **System Design**: API Gateway, Caching, Load Balancers, Order Management
- **Profile Building**: LinkedIn, Resume, GitHub
- **Mock Interviews**: DSA and System Design practice
- **Applications & Referrals**: Job applications and networking

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (if using MongoDB)
   - Click "Deploy"

3. **Your app is live!**
   Vercel will provide a URL like `your-app.vercel.app`

### Environment Variables on Vercel
Make sure to add these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_START_DATE` (defaults to 2025-10-16)

## 🗄️ Database Setup (Already Configured!)

### ✅ Your Supabase Database is Ready

Your project is already connected to Supabase! Just need to create the tables:

1. **Go to Supabase Dashboard**
   - Visit [app.supabase.com](https://app.supabase.com)
   - Select your project: `mrykshinqyowgexuniev`

2. **Run SQL Schema**
   - Click **SQL Editor** in sidebar
   - Click "New query"
   - Copy entire contents of `lib/supabase-schema.sql`
   - Paste and click "Run"
   - You'll see "Success. No rows returned"

3. **Verify Tables Created**
   - Click **Table Editor** in sidebar
   - You should see: `tasks`, `programs`, `projects`

**That's it!** Your database is ready. ✅

See `SUPABASE_SETUP.md` for detailed setup guide.

### Without Supabase
If you prefer not to set up the database, the app will automatically use localStorage for data persistence. This works great for personal use but data will be browser-specific.

## 🎯 Customization

### Update Start Date
Edit `NEXT_PUBLIC_START_DATE` in `.env` to match when you start your 30-day journey:
```env
NEXT_PUBLIC_START_DATE=2025-10-16
```

### Modify Roadmap
Edit `lib/plan.json` to customize your 30-day plan:
```json
[
  { 
    "day": 1, 
    "tasks": [
      { 
        "title": "Your Task", 
        "description": "Task description", 
        "category": "DSA" 
      }
    ]
  }
]
```

### Add Categories
Update `getCategoryColor()` in `lib/utils.ts` to add new category colors.

## 🏗️ Project Structure

```
new-job-journey/
├── app/
│   ├── api/              # API routes for MongoDB operations
│   ├── programs/         # Programs tracking page
│   ├── projects/         # SAP projects page
│   ├── revision/         # Revision hub page
│   ├── tasks/            # All tasks page
│   ├── layout.tsx        # Root layout with sidebar
│   ├── page.tsx          # Dashboard (home page)
│   └── globals.css       # Global styles
├── components/
│   ├── Navbar.tsx        # Top navigation bar
│   ├── ProgressBar.tsx   # Progress visualization
│   ├── Sidebar.tsx       # Side navigation
│   ├── TaskCard.tsx      # Reusable task card
│   └── ThemeProvider.tsx # Dark/light theme provider
├── lib/
│   ├── mongodb.ts        # MongoDB connection
│   ├── plan.json         # 30-day roadmap seed data
│   └── utils.ts          # Utility functions
├── models/
│   ├── Program.ts        # Program model
│   ├── Project.ts        # Project model
│   └── Task.ts           # Task model
├── types/
│   └── global.d.ts       # TypeScript global types
└── package.json
```

## 🛠️ Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

This is a personal interview prep tracker, but feel free to fork and customize for your own use!

## 📝 License

MIT License - feel free to use this for your own interview preparation.

## 🎓 Tips for Success

1. **Start on Day 1**: Set your start date and stick to the schedule
2. **Daily Consistency**: Complete tasks every day, even if just for 30 minutes
3. **Use Reference Links**: Add links to articles, videos, or notes for quick revision
4. **Mark for Revision**: Use the Revision Hub to review topics regularly
5. **Track Everything**: Log all problems and projects for your resume
6. **Stay Flexible**: Adjust the roadmap based on your progress
7. **Review Weekly**: Every 7 days, review what you've learned

## 🎯 Target Companies

This roadmap is specifically designed for:
- **Walmart Global Tech** (Full-stack, Backend roles)
- **SAP Labs India** (CAP, BTP, Full-stack roles)

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your `.env` configuration
3. Ensure all dependencies are installed
4. Check MongoDB connection (if using)

## ✨ Future Enhancements

Potential features to add:
- [ ] NextAuth authentication for multi-user support
- [ ] Notion API integration for notes
- [ ] Export progress as PDF
- [ ] Streak tracking and gamification
- [ ] Mobile app (React Native)
- [ ] Email reminders for daily tasks

---

**Good luck with your interview preparation!** 🚀

Target: Walmart Global Tech & SAP Labs India
Timeline: 30 Days
Outcome: Dream Job ✅
