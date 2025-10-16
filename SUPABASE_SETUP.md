# 🚀 Supabase Setup Guide

Quick guide to set up Supabase with PostgreSQL for Career Compass.

## Why Supabase?

✅ **Easier than MongoDB** - Simple setup, no complex connection strings  
✅ **Better Free Tier** - 500MB database, 2GB file storage, 50MB file uploads  
✅ **PostgreSQL** - More powerful than MongoDB for relational data  
✅ **Built-in Auth** - Easy to add authentication later  
✅ **Real-time** - Live updates across devices (optional)  
✅ **Auto APIs** - REST and GraphQL APIs generated automatically  

---

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### Step 2: Create a New Project

1. Click "New Project"
2. Fill in details:
   - **Name:** career-compass
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
3. Click "Create new project"
4. Wait ~2 minutes for setup

### Step 3: Create Database Tables

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `lib/supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned"

### Step 4: Get Your API Keys

1. Click **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see two things you need:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 5: Add to Your Project

1. Open your project folder
2. Create or edit `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   NEXT_PUBLIC_APP_NAME=Career Compass
   NEXT_PUBLIC_START_DATE=2025-10-16
   ```

### Step 6: Install and Run

```bash
# Install dependencies (includes @supabase/supabase-js)
npm install

# Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you're done! 🎉

---

## 📊 Verify Setup

### Check in Supabase Dashboard:

1. Go to **Table Editor** in Supabase
2. You should see 3 tables:
   - `tasks`
   - `programs`
   - `projects`

### Check in Your App:

1. Complete a task on the dashboard
2. Go to Supabase dashboard → **Table Editor** → **tasks**
3. You should see your completed task!

---

## 🔍 Understanding the Tables

### Tasks Table
Stores your 30-day roadmap progress:
- `day` - Which day (1-30)
- `title` - Task name
- `completed` - Checkbox state
- `reference_link` - URL for quick recall
- `revised` - Marked for revision

### Programs Table
Tracks coding problems:
- `name` - Problem name
- `link` - LeetCode/GFG URL
- `category` - DSA topic
- `difficulty` - Easy/Medium/Hard
- `status` - Progress tracking

### Projects Table
Your portfolio:
- `title` - Project name
- `repo_link` - GitHub URL
- `deployed_link` - Live URL
- `technologies` - Tech stack array
- `status` - Planning/In Progress/Completed

---

## 🎨 Supabase Dashboard Features

### Table Editor
- View all your data
- Edit rows directly
- Filter and search
- Export to CSV

### SQL Editor
- Run custom queries
- Create views
- Add functions
- Optimize performance

### API Docs
- Auto-generated REST API
- Example code in multiple languages
- Test endpoints directly

### Database
- View relationships
- Check indexes
- Monitor performance
- Run backups

---

## 🔐 Security (Row Level Security)

The schema includes basic RLS policies that allow all operations. 

**For production**, you might want to restrict access:

```sql
-- Example: Only allow authenticated users
CREATE POLICY "Authenticated users only" ON tasks
FOR ALL USING (auth.uid() IS NOT NULL);
```

For now, the open policy is fine for personal use!

---

## 🚀 Deploy to Vercel with Supabase

Your environment variables will work in Vercel automatically!

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_START_DATE`
4. Deploy!

Vercel will use Supabase; locally you can use localStorage if you prefer.

---

## 💾 localStorage Fallback

**No Supabase setup?** The app still works!

- Data stored in browser
- No account needed
- Completely private
- Device-specific

Just don't add the Supabase env variables and the app will automatically use localStorage.

---

## 🆚 Supabase vs MongoDB

| Feature | Supabase | MongoDB |
|---------|----------|---------|
| **Setup Time** | 5 minutes | 15-20 minutes |
| **Free Tier** | 500MB DB + 2GB storage | 512MB DB only |
| **Connection** | Simple URL + Key | Complex connection string |
| **Dashboard** | Beautiful UI | Basic |
| **Built-in Auth** | Yes | No |
| **Real-time** | Yes | Requires setup |
| **Learning Curve** | Easy | Moderate |

---

## 🔧 Troubleshooting

### "Failed to fetch" errors?

**Check:**
1. Supabase URL is correct in `.env`
2. Anon key is correct
3. Both start with `NEXT_PUBLIC_`
4. You restarted dev server after adding env vars

### Can't see data in Supabase?

**Check:**
1. SQL schema was run successfully
2. Tables exist in Table Editor
3. RLS policies are enabled
4. You're looking at the right project

### App says "Using localStorage"?

**This means:**
- Supabase env vars not found
- Check `.env` file exists
- Check variable names are correct
- Restart dev server

---

## 📈 Supabase Free Tier Limits

**More than enough for this app:**
- ✅ 500MB database (holds 1000s of tasks)
- ✅ 50,000 monthly active users
- ✅ 2GB file storage
- ✅ 50MB file upload limit
- ✅ 5GB bandwidth per month
- ✅ Unlimited API requests

You'd need to track 50,000+ tasks to hit the limit! 🚀

---

## 🎓 Advanced: Supabase Studio

Access your database locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Start local development
supabase start
```

This gives you a local Supabase instance for development!

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [SQL Cheatsheet](https://supabase.com/docs/guides/database/sql-cheatsheet)

---

## ✅ Setup Complete!

You now have:
- ✅ Supabase project created
- ✅ Database tables set up
- ✅ API keys configured
- ✅ App connected to Supabase
- ✅ Data persisting to PostgreSQL

**Start tracking your interview prep!** 🎯

---

**Need help?** 
- Check [Supabase Discord](https://discord.supabase.com)
- Read [Supabase Docs](https://supabase.com/docs)
- Review the SQL schema in `lib/supabase-schema.sql`


