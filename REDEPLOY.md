# Redeployment Guide

## ✅ Changes Pushed to GitHub

All fixes have been committed and pushed. Now you need to redeploy your application.

## 🔧 Critical Step: Set Environment Variables

### Frontend Environment Variable (REQUIRED)

**You MUST set this environment variable in your frontend deployment:**

- **Variable Name:** `VITE_API_URL`
- **Variable Value:** Your backend URL (e.g., `https://your-backend.onrender.com` or `https://your-backend.railway.app`)

**⚠️ Important:** 
- Do NOT include a trailing slash
- Use `https://` (not `http://`)
- Example: `https://feedback-api.onrender.com` ✅
- Wrong: `https://feedback-api.onrender.com/` ❌

### Backend Environment Variables

Make sure these are set:
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Usually auto-set by platform

## 📋 Redeployment Steps by Platform

### Option 1: Render

#### Frontend (Static Site):
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your frontend service
3. Go to **Environment** tab
4. Add/Update: `VITE_API_URL` = `https://your-backend-url.onrender.com`
5. Click **Save Changes**
6. Go to **Manual Deploy** → **Deploy latest commit**
   - OR it will auto-deploy if connected to GitHub

#### Backend (Web Service):
1. Find your backend service
2. It should auto-deploy from GitHub
3. If not, go to **Manual Deploy** → **Deploy latest commit**

### Option 2: Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update: `VITE_API_URL` = `https://your-backend-url.com`
5. Select **Production**, **Preview**, and **Development**
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment
   - OR push a new commit to trigger auto-deploy

### Option 3: Railway

#### Frontend:
1. Go to [Railway Dashboard](https://railway.app)
2. Select your frontend service
3. Go to **Variables** tab
4. Add/Update: `VITE_API_URL` = `https://your-backend-url.com`
5. Railway will auto-redeploy

#### Backend:
1. Select your backend service
2. Railway will auto-deploy from GitHub

### Option 4: Netlify (Frontend)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add/Update: `VITE_API_URL` = `https://your-backend-url.com`
5. Go to **Deploys** tab
6. Click **Trigger deploy** → **Deploy site**
   - OR it will auto-deploy from GitHub

## 🔍 How to Verify It's Working

### Step 1: Check Environment Variable is Set
1. After redeploy, open your website
2. Press `F12` to open browser console
3. You should see: `Current API URL: https://your-backend-url.com`
4. If it shows `http://localhost:5000`, the variable is NOT set correctly

### Step 2: Test Backend Connection
1. Open browser console (F12)
2. Try submitting feedback
3. Check console for:
   - ✅ `Submitting feedback to: https://your-backend-url.com/api/feedback`
   - ✅ `Response status: 201` (success)
   - ❌ Any error messages in red

### Step 3: Check Network Tab
1. Open browser DevTools → **Network** tab
2. Try submitting feedback
3. Look for the POST request to `/api/feedback`
4. Check:
   - Status should be `201` or `200` (success)
   - Response should show `{"success": true, ...}`

## 🐛 If It Still Doesn't Work

1. **Check Browser Console:**
   - Look for error messages
   - Check what API URL is being used

2. **Verify Backend is Running:**
   - Visit: `https://your-backend-url.com/`
   - Should show: "Feedback API is running"

3. **Test Backend API:**
   - Visit: `https://your-backend-url.com/api/feedback/stats`
   - Should return JSON data

4. **Check Environment Variables:**
   - Make sure `VITE_API_URL` is set correctly
   - Make sure you **rebuilt/redeployed** after setting it
   - Vite bakes environment variables at build time!

5. **Check Backend Logs:**
   - Look for CORS errors
   - Look for MongoDB connection errors
   - Look for any request errors

## 📝 Quick Checklist

- [ ] Changes pushed to GitHub ✅ (Already done)
- [ ] `VITE_API_URL` set in frontend deployment platform
- [ ] Frontend redeployed/rebuilt
- [ ] Backend redeployed (if needed)
- [ ] Tested in browser - console shows correct API URL
- [ ] Tested submitting feedback - works!

## 🎯 Most Common Issue

**Environment variable not set or not rebuilt:**
- Setting `VITE_API_URL` is not enough
- You MUST rebuild/redeploy the frontend after setting it
- Vite environment variables are compiled into the build

## 💡 Pro Tip

After setting environment variables, always:
1. Wait for deployment to complete
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Check browser console for the API URL

---

**Need help?** Check `TROUBLESHOOTING.md` for detailed debugging steps!

