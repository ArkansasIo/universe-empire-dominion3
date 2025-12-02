# ✅ Deployment Checklist for Stellar Dominion

## Pre-Deployment Requirements

- [ ] Push code to GitHub
- [ ] Database: Add `DATABASE_URL` to secrets
- [ ] Run `npm run db:push` locally to verify schema
- [ ] Test app works: `npm run dev`
- [ ] No console errors
- [ ] All environment variables set locally

## Choose Your Platform

### Option 1: Railway (Easiest) ⭐
- [ ] Go to railway.app
- [ ] Sign up with GitHub
- [ ] Create new project from GitHub repo
- [ ] Add PostgreSQL database
- [ ] Set `DATABASE_URL` environment variable
- [ ] Click Deploy
- [ ] Wait 2-3 minutes
- [ ] Visit provided URL

### Option 2: Render
- [ ] Go to render.com
- [ ] Sign up with GitHub
- [ ] Create Web Service from repo
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Add PostgreSQL database
- [ ] Deploy

### Option 3: Fly.io
- [ ] Install flyctl: `brew install flyctl`
- [ ] Run: `fly auth login`
- [ ] Run: `fly launch`
- [ ] Run: `fly postgres create`
- [ ] Run: `fly postgres attach`
- [ ] Run: `fly deploy`

## Post-Deployment

- [ ] Visit deployed URL
- [ ] Test login (will work once DATABASE_URL is set)
- [ ] Check browser console for errors
- [ ] Test key features (resources, buildings, etc.)
- [ ] Verify database connection works
- [ ] Add custom domain (optional)
- [ ] Share with friends! 🎉

## Troubleshooting

**Can't login after deployment?**
→ Check `DATABASE_URL` is set in platform's environment variables

**Build fails?**
→ Run `npm install` and `npm run build` locally to test

**Page looks broken?**
→ Check browser console (F12) for errors
→ Hard refresh (Ctrl+Shift+R)

**Database connection error?**
→ Verify DATABASE_URL format
→ Run `npm run db:push` to initialize schema
→ Check Neon endpoint is active

---

## Your Deployed App Will Be Live At:

**Railway:** `https://[project-name].up.railway.app`
**Render:** `https://[project-name].onrender.com`
**Fly.io:** `https://[app-name].fly.dev`

**Add custom domain:** Available on all platforms!

---

## Support

- Railway support: https://railway.app/support
- Render support: https://render.com/support
- Fly.io support: https://fly.io/docs

Good luck deploying Stellar Dominion! 🚀
