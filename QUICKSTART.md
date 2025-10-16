# 🚀 Quick Start Guide

Get Career Compass running in 5 minutes!

## ✅ Your Project is Pre-Configured!

Good news! Your Supabase database is already connected. Just need to set up the tables.

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Tables (2 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (mrykshinqyowgexuniev)
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"**
5. Open `lib/supabase-schema.sql` in your project
6. Copy the entire file contents
7. Paste into the SQL editor
8. Click **"Run"** (or press Ctrl/Cmd + Enter)
9. You should see: ✅ "Success. No rows returned"

### 3. Verify Tables Created

1. In Supabase dashboard, click **Table Editor**
2. You should see 3 tables:
   - ✅ `tasks`
   - ✅ `programs`
   - ✅ `projects`

### 4. Start the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## First Time Usage

### 1. Explore the Dashboard
- View Day 1 of your 30-day roadmap
- See today's tasks
- Check out the progress tracking

### 2. Complete Your First Task
- Click the checkbox to mark a task complete
- Add a reference link for quick recall
- Watch your progress increase!

### 3. Verify Database Connection
- Complete a task
- Go back to Supabase → Table Editor → tasks
- You should see your completed task! ✅

---

## Without Supabase (Optional)

Don't want to use Supabase? The app works with localStorage!

Just skip the SQL setup and run:
```bash
npm run dev
```

Your data will be stored locally in your browser.

---

## Deploy to Vercel (5 minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main

# 2. Go to vercel.com and import your repo

# 3. Add environment variables:
NEXT_PUBLIC_SUPABASE_URL=https://mrykshinqyowgexuniev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_START_DATE=2025-10-16

# 4. Deploy!
```

---

## Troubleshooting

### "Failed to fetch" errors?
- Make sure you ran the SQL schema in Supabase
- Check that tables exist in Table Editor
- Verify `.env` file has your Supabase credentials

### Can't see data in Supabase?
- Refresh the Table Editor page
- Check you're in the correct project
- Verify the SQL schema ran successfully

### App says "Using localStorage"?
- This means Supabase env vars not found
- Check `.env` file exists in project root
- Restart the dev server: `npm run dev`

---

## Next Steps

✅ **Day 1:** Complete your profile updates and Java OOPs revision  
✅ **Week 1:** Build momentum with daily tasks  
✅ **Week 2:** Start your SAP BTP project  
✅ **Week 3:** Ramp up DSA practice  
✅ **Week 4:** Mock interviews and job applications  

**Good luck with your interview prep!** 🎯

---

For detailed documentation:
- 📖 See `README.md` for complete guide
- 🗄️ See `SUPABASE_SETUP.md` for database details
- ✨ See `FEATURES.md` for feature overview
