# Deployment Guide

This guide covers deploying the Feedback Dashboard application to various platforms.

## Project Structure

- **Frontend**: React + Vite (located in `frontend/`)
- **Backend**: Express.js + MongoDB (located in `backend/`)

## Prerequisites

1. MongoDB database (MongoDB Atlas recommended for cloud deployment)
2. Node.js installed locally for building
3. Git repository (for most deployment platforms)

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
```

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

#### Backend Deployment:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: `feedback-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: (auto-generated)
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
6. Click "Create Web Service"
7. Copy the service URL (e.g., `https://feedback-api.onrender.com`)

#### Frontend Deployment:
1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your Git repository
3. Configure:
   - **Name**: `feedback-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://feedback-api.onrender.com`)
5. Click "Create Static Site"

**Note**: Render's free tier spins down after inactivity. Consider upgrading for production use.

---

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Backend on Railway:
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add Environment Variables:
   - `PORT`: (auto-set)
   - `MONGODB_URI`: Your MongoDB connection string
5. Railway will auto-detect and deploy
6. Copy the generated URL

#### Frontend on Vercel:
1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your Railway backend URL
6. Click "Deploy"

---

### Option 3: Deploy Both on Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add two services:
   - **Backend Service**:
     - Root Directory: `backend`
     - Start Command: `npm start`
     - Environment Variables: `MONGODB_URI`
   - **Frontend Service**:
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run preview` (or use static hosting)
     - Environment Variables: `VITE_API_URL` (point to backend service URL)

---

### Option 4: Heroku

#### Backend:
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name-api`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git subtree push --prefix backend heroku main`

#### Frontend:
1. Create app: `heroku create your-app-name-frontend`
2. Build and deploy static files (requires buildpack configuration)

---

## MongoDB Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for cloud deployments)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
6. Use this in your `MONGODB_URI` environment variable

## Local Testing Before Deployment

1. **Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your backend URL
   npm install
   npm run dev
   ```

3. Test the application locally before deploying.

## Post-Deployment Checklist

- [ ] Backend is accessible and returns health check
- [ ] Frontend can connect to backend API
- [ ] MongoDB connection is working
- [ ] CORS is properly configured (backend allows frontend origin)
- [ ] Environment variables are set correctly
- [ ] Test creating feedback
- [ ] Test viewing feedbacks
- [ ] Test stats endpoint

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure your backend allows your frontend origin:
```javascript
// In backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
```

### Environment Variables Not Working
- Vite requires `VITE_` prefix for environment variables
- Rebuild after changing environment variables
- Check that variables are set in deployment platform dashboard

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

## Support

For issues, check:
- Platform-specific documentation
- Application logs in deployment dashboard
- Browser console for frontend errors
- Backend logs for API errors

