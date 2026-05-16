# 🚀 Quick Start Guide

Get your AI Interior Design Portal authentication system up and running in minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8+ installed (`python --version`)
- ✅ Node.js 16+ installed (`node --version`)
- ✅ PostgreSQL 12+ installed and running

## 🎯 Quick Setup (5 Minutes)

### Step 1: Database Setup (1 minute)

Open PostgreSQL and create the database:

```sql
CREATE DATABASE interior_design_db;
```

Or use command line:
```bash
psql -U postgres -c "CREATE DATABASE interior_design_db;"
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment (edit .env file with your PostgreSQL password)
# The .env file is already created, just update DB_PASSWORD if needed

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend is now running at `http://localhost:8000` ✅

### Step 3: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend is now running at `http://localhost:5173` ✅

## 🎉 You're Done!

Visit `http://localhost:5173` and you should see the login page!

## 🧪 Test the System

1. **Create an account:**
   - Click "Sign up" 
   - Fill in your details
   - Submit the form
   - You'll be redirected to the dashboard

2. **Test logout:**
   - Click the "Logout" button
   - You'll be redirected to login

3. **Test login:**
   - Use your credentials to log back in
   - You'll see the dashboard again

## 🔧 Troubleshooting

### Backend Issues

**Problem:** `connection to server at "localhost" failed`
- **Solution:** Make sure PostgreSQL is running
- Check your `.env` file has correct database credentials

**Problem:** `ModuleNotFoundError`
- **Solution:** Make sure you installed all requirements:
  ```bash
  pip install -r requirements.txt
  ```

**Problem:** `Port 8000 already in use`
- **Solution:** Kill the process or use a different port:
  ```bash
  python manage.py runserver 8001
  ```
  Then update frontend `.env`: `VITE_API_URL=http://localhost:8001/api`

### Frontend Issues

**Problem:** `Cannot find module`
- **Solution:** Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem:** `Port 5173 already in use`
- **Solution:** The dev server will automatically use the next available port

**Problem:** API calls failing
- **Solution:** Check that:
  - Backend is running on port 8000
  - `.env` file has correct `VITE_API_URL`
  - CORS is properly configured in backend

## 📱 API Testing

You can test the API directly using curl or Postman:

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### Get Profile (requires token)
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🎨 What's Next?

Now that authentication is working, you can:

1. **Customize the UI:**
   - Edit `frontend/src/pages/Dashboard.jsx`
   - Modify colors in `frontend/tailwind.config.js`
   - Update styles in `frontend/src/index.css`

2. **Add Features:**
   - Create new protected pages
   - Add user profile editing
   - Implement password reset
   - Add email verification

3. **Build AI Features:**
   - Add image upload for room analysis
   - Integrate AI design generation
   - Create design history
   - Add sharing functionality

## 📚 Learn More

- [Full README](README.md) - Complete documentation
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 💡 Tips

- Use the Django admin panel at `http://localhost:8000/admin` to manage users
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors
- Use React DevTools to inspect component state
- Use localStorage in browser DevTools to see stored tokens

## 🆘 Need Help?

If you're stuck:
1. Check the error message carefully
2. Look in the troubleshooting section above
3. Check that all services are running
4. Verify environment variables are set correctly
5. Try restarting both servers

Happy coding! 🚀
