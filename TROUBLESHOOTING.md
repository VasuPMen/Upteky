# Troubleshooting Guide - Feedback Not Being Added

If feedback is not being added on your hosted website, follow these steps:

## Step 1: Check Browser Console

1. Open your hosted website
2. Press `F12` or right-click → "Inspect" → "Console" tab
3. Try to submit feedback
4. Look for error messages in red

**Common errors you might see:**
- `Failed to fetch` - Backend is not accessible
- `CORS error` - Backend is blocking requests from your frontend
- `404 Not Found` - API endpoint is wrong
- `Network error` - Backend URL is incorrect

## Step 2: Verify Environment Variables

### Frontend (VITE_API_URL)
The frontend needs to know where your backend is located.

**Check if it's set:**
1. Open browser console
2. You should see: `Current API URL: https://your-backend-url.com`
3. If it shows `http://localhost:5000`, the environment variable is NOT set

**How to fix:**
- **Vercel**: Go to Project Settings → Environment Variables → Add `VITE_API_URL` = `https://your-backend-url.com`
- **Netlify**: Site Settings → Environment Variables → Add `VITE_API_URL` = `https://your-backend-url.com`
- **Render**: Environment Variables → Add `VITE_API_URL` = `https://your-backend-url.com`
- **Railway**: Variables → Add `VITE_API_URL` = `https://your-backend-url.com`

**Important:** After setting environment variables, you MUST rebuild/redeploy your frontend!

### Backend (MONGODB_URI and PORT)
1. Check your backend deployment platform
2. Verify `MONGODB_URI` is set correctly
3. Verify `PORT` is set (most platforms set this automatically)

## Step 3: Test Backend Directly

Test if your backend is working:

1. Open your backend URL in browser: `https://your-backend-url.com/`
   - Should show: "Feedback API is running"

2. Test the API endpoint:
   - Open: `https://your-backend-url.com/api/feedback/stats`
   - Should return JSON with stats

3. Test POST request (use Postman, curl, or browser console):
   ```javascript
   fetch('https://your-backend-url.com/api/feedback', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'Test User',
       message: 'Test message',
       rating: 5
     })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

## Step 4: Check CORS Configuration

If you see CORS errors in console:

1. Your backend needs to allow requests from your frontend domain
2. Check `backend/server.js` - it should allow your frontend URL

**Current configuration allows all origins (`*`), which should work.**

If you want to restrict it:
```javascript
// In backend/server.js
const corsOptions = {
  origin: 'https://your-frontend-url.com', // Your actual frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## Step 5: Check Backend Logs

1. Go to your backend deployment platform dashboard
2. Check the logs/console
3. Look for:
   - MongoDB connection errors
   - Server startup errors
   - Request errors

## Step 6: Verify MongoDB Connection

1. Check if MongoDB Atlas (or your MongoDB) is accessible
2. Verify IP whitelist includes `0.0.0.0/0` (all IPs) for cloud deployments
3. Check MongoDB connection string format

## Common Issues and Solutions

### Issue: "Failed to fetch" or Network Error
**Cause:** Backend URL is wrong or backend is down
**Solution:**
- Verify backend is deployed and running
- Check backend URL is correct in `VITE_API_URL`
- Rebuild frontend after setting environment variable

### Issue: CORS Error
**Cause:** Backend is blocking requests from frontend
**Solution:**
- Backend already allows all origins (`*`)
- If still having issues, check backend logs

### Issue: 404 Not Found
**Cause:** API endpoint URL is wrong
**Solution:**
- Verify `VITE_API_URL` doesn't have trailing slash
- Should be: `https://api.example.com` (not `https://api.example.com/`)
- Check backend routes are correct

### Issue: Feedback shows success but doesn't appear
**Cause:** Database connection issue or refresh problem
**Solution:**
- Check backend logs for MongoDB errors
- Verify MongoDB connection string
- Check if data is actually saved in database

### Issue: Environment variable not working
**Cause:** Frontend not rebuilt after setting variable
**Solution:**
- **Vite requires rebuild** after changing environment variables
- Redeploy your frontend
- Environment variables are baked into the build at build time

## Quick Checklist

- [ ] Backend is deployed and accessible
- [ ] Backend health check works (`https://backend-url.com/`)
- [ ] `VITE_API_URL` is set in frontend deployment platform
- [ ] Frontend was rebuilt after setting `VITE_API_URL`
- [ ] `MONGODB_URI` is set in backend
- [ ] MongoDB is accessible (IP whitelist configured)
- [ ] No CORS errors in browser console
- [ ] Backend logs show no errors
- [ ] Browser console shows correct API URL

## Still Having Issues?

1. **Check browser console** - Look for specific error messages
2. **Check backend logs** - Look for server-side errors
3. **Test backend directly** - Use Postman or curl to test API
4. **Verify URLs** - Make sure both frontend and backend URLs are correct
5. **Check network tab** - In browser DevTools, see the actual HTTP requests/responses

## Debug Information

The updated code now includes:
- Console logging of API URLs
- Detailed error messages
- Alert popups with error details
- Debug mode indicator in development

Check your browser console for detailed information about what's happening!

