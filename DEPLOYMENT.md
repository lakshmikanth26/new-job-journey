# 🚀 Deployment Guide

Complete guide to deploying Career Compass to production.

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (optional)

### Step-by-Step

#### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Career Compass app"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/career-compass.git
git branch -M main
git push -u origin main
```

#### 2. Set Up MongoDB (Optional)

If you want persistent cloud storage:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Grant "Atlas Admin" role

4. Configure network access:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allow from anywhere)

5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "4.1 or later"
   - Copy the connection string
   - Replace `<password>` with your database user password

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/career-compass?retryWrites=true&w=majority
```

#### 3. Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   Add these in the "Environment Variables" section:
   
   **Required:**
   ```
   NEXT_PUBLIC_START_DATE=2025-10-16
   ```
   
   **Optional (for MongoDB):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career-compass?retryWrites=true&w=majority
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app is live! 🎉

5. **Access Your App**
   - Vercel will provide a URL: `your-app-name.vercel.app`
   - You can also add a custom domain

#### 4. Post-Deployment

**Test your deployment:**
- Visit your Vercel URL
- Check that the dashboard loads
- Try marking a task as complete
- Verify data persistence (refresh page)

**Set up automatic deployments:**
- Every push to `main` branch will auto-deploy
- Create a `dev` branch for testing before pushing to main

## Alternative: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build your app
npm run build

# Deploy
netlify deploy --prod
```

Add environment variables in Netlify dashboard under "Site settings" → "Environment variables"

## Alternative: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy!

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | No | MongoDB connection string | `mongodb+srv://...` |
| `NEXT_PUBLIC_START_DATE` | No | Your journey start date | `2025-10-16` |
| `NEXT_PUBLIC_APP_NAME` | No | App name | `Career Compass` |

## Vercel-Specific Configuration

The included `vercel.json` configures:
- Build command: `npm run build`
- Install command: `npm install`
- Framework detection: Next.js
- Region: `iad1` (US East)

## Troubleshooting Deployment

### Build fails on Vercel

**Issue:** TypeScript errors during build

**Solution:**
```bash
# Run locally to check for errors
npm run build

# Fix any TypeScript errors
npm run lint
```

### MongoDB connection fails in production

**Issue:** Can't connect to MongoDB Atlas

**Solutions:**
1. Check Network Access in MongoDB Atlas
   - Ensure `0.0.0.0/0` is added
2. Verify connection string in Vercel environment variables
3. Check database user credentials
4. Make sure database name is correct in connection string

### Environment variables not working

**Issue:** `NEXT_PUBLIC_*` variables showing as undefined

**Solution:**
1. Redeploy after adding/changing env vars
2. Make sure variable names start with `NEXT_PUBLIC_` for client-side access
3. Check that variables are set in Vercel dashboard

### App works locally but not in production

**Issue:** Different behavior between local and production

**Solutions:**
1. Check browser console for errors
2. Review Vercel function logs
3. Verify all dependencies are in `package.json`
4. Make sure `.env.local` values match Vercel env vars

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster response times globally, you can enable Vercel Edge Runtime for API routes:

```typescript
// In app/api/tasks/route.ts
export const runtime = 'edge';
```

### Enable ISR (Incremental Static Regeneration)

For better performance with static pages:

```typescript
// In app/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
1. Go to your project
2. Click "Analytics" tab
3. Enable Web Analytics

### Check Function Logs

View logs in real-time:
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. Click "Functions" or "Runtime Logs"

## Custom Domain Setup

1. **Buy a domain** (Namecheap, GoDaddy, Google Domains)

2. **Add to Vercel:**
   - Go to project settings
   - Click "Domains"
   - Add your domain
   - Follow DNS configuration instructions

3. **Configure DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records as instructed

4. **Wait for DNS propagation** (can take up to 24 hours)

## Security Best Practices

1. **Never commit `.env` files** to GitHub
2. **Use environment variables** for all secrets
3. **Rotate MongoDB credentials** periodically
4. **Restrict MongoDB network access** to specific IPs if possible
5. **Enable Vercel password protection** for development deployments

## Cost Estimates

**Free Tier Includes:**
- Vercel: Unlimited deployments, 100GB bandwidth/month
- MongoDB Atlas: 512MB storage, shared clusters
- Total: $0/month for personal use

**Paid Plans (if needed):**
- Vercel Pro: $20/month (better performance, team features)
- MongoDB M10: $0.08/hour ($57/month) for dedicated cluster

## Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
3. Review [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

**Happy Deploying!** 🚀

