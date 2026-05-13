# CineVault Vercel Deployment Guide

## ✅ Issues Fixed

Your backend deployment had several issues that have been resolved:

1. **Async initialization bug** - Schema creation wasn't properly awaited, causing crashes
2. **Database client error** - Empty Turso credentials caused immediate failure
3. **Missing error handling** - No graceful fallback for missing env vars
4. **Frontend hardcoded API URL** - Now uses localhost in dev, Vercel URL in production

## 🚀 Deploying to Vercel

### Step 1: Verify Local Setup Works ✓

- Backend: http://localhost:5000 (running)
- Frontend: http://localhost:5173 (running)
- Health check: http://localhost:5000/api/health

### Step 2: Configure Vercel Environment Variables

For your **backend** project on Vercel, add these environment variables:

```
TURSO_DB_URL=libsql://cinevault-benail30.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzg2ODY0NTQsImlkIjoiMDE5ZTIxZjgtNWQwMS03ODQ5LTk2YTQtNTAzMGQ0MmFhZDFkIiwicmlkIjoiM2UyMzMwNWQtNjRlMC00NWJhLWI5YTEtMjMwNmMxNTFjODIyIn0.9KoFjb0B84zwhIje0zIv-z79k1wLJPbOM117VXJJzvUfgdwwhy6GK6lfXWJ3EoAzlpSmBvLBEn75yig19EC2Cg
NODE_ENV=production
```

**To add these:**

1. Go to https://vercel.com/dashboard
2. Select your backend project (cinephiles-inc-api)
3. Settings → Environment Variables
4. Paste the TURSO_DB_URL and TURSO_AUTH_TOKEN
5. Redeploy

### Step 3: Redeploy Backend

```bash
# In backend directory
git add .
git commit -m "Fix deployment: async initialization and Turso config"
git push
```

Vercel will automatically redeploy. Monitor the deployment in your Vercel dashboard.

### Step 4: Verify Backend is Working

Once deployed, test:

```
curl https://cinephiles-inc-api.vercel.app/api/health
```

You should get:

```json
{ "status": "ok", "message": "CineVault backend is running!" }
```

### Step 5: Redeploy Frontend (if needed)

The frontend already points to the correct backend URL in production:

```javascript
// In production: https://cinephiles-inc-api.vercel.app/api
// In development: http://localhost:5000/api (auto-detected)
```

If you want to make sure, just commit any changes:

```bash
# In frontend directory
git add .
git commit -m "Update API service for environment-aware URLs"
git push
```

## 📝 Key Changes Made

### 1. backend/src/db/schema.js

- Added proper error handling with try-catch
- Ensured async initialization completes with .catch()
- Better console logging for debugging

### 2. backend/src/app.js

- Moved schema initialization to middleware
- Added lazy initialization on first request
- Better separation of concerns

### 3. backend/src/db/database.js

- Added error handling for missing credentials
- Better warning messages
- Graceful fallback for development

### 4. frontend/src/services/api.js

- Dynamic API URL detection
- Uses localhost in development
- Uses Vercel URL in production

### 5. backend/.env.example

- Created template for environment variables
- Shows required Turso configuration

## 🔍 Testing Checklist

- [x] Backend starts locally without crashes
- [x] Database tables are created in Turso
- [x] Frontend can connect to local backend
- [x] Health check endpoint responds
- [ ] Backend deployed to Vercel
- [ ] Verify Turso tables exist in production
- [ ] Test frontend → backend → Turso connection
- [ ] Check CORS headers are correct

## 🆘 If Issues Persist

1. **Check Vercel logs:**
   - Go to your backend project in Vercel
   - Functions → Select region → View logs
2. **Check Turso connection:**
   - Open Turso dashboard
   - Verify database exists
   - Check auth token is valid

3. **Common errors:**
   - "URL_INVALID" = TURSO_DB_URL not set or invalid
   - "Can't authenticate" = TURSO_AUTH_TOKEN wrong
   - "CORS error" = Check cors() in app.js includes your frontend URL

## 📚 Useful Resources

- Turso docs: https://docs.turso.tech/
- Vercel deployment: https://vercel.com/docs
- Environment variables: https://vercel.com/docs/concepts/projects/environment-variables
