# AI-Powered Interior Design Portal - Authentication Module

A complete authentication system for an AI-powered Interior Design SaaS platform built with Django REST Framework and React.

## 🚀 Features

### Backend (Django REST Framework)
- ✅ Custom User Model with email authentication
- ✅ JWT-based authentication (access & refresh tokens)
- ✅ User Signup API
- ✅ User Login API
- ✅ Token Refresh API
- ✅ User Profile API (protected)
- ✅ Logout API with token blacklisting
- ✅ Password hashing and validation
- ✅ PostgreSQL database integration
- ✅ CORS configuration
- ✅ Environment variable management

### Frontend (React + Vite)
- ✅ Modern dark mode UI with glassmorphism
- ✅ Login & Signup pages
- ✅ Protected routes
- ✅ JWT token management
- ✅ Persistent authentication (localStorage)
- ✅ Automatic token refresh
- ✅ AuthContext for global state
- ✅ Axios API service with interceptors
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Gradient buttons and smooth animations

## 📁 Project Structure

```
.
├── backend/
│   ├── authentication/          # Authentication app
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API views
│   │   └── urls.py             # URL routing
│   ├── authentication/         # Auth app and custom user model
│   │   ├── models.py           # Custom User model
│   │   └── admin.py            # Admin configuration
│   ├── backend/
│   │   ├── settings.py         # Django settings
│   │   └── urls.py             # Main URL configuration
│   ├── manage.py
│   └── .env.example            # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Axios configuration
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx       # Login page
    │   │   ├── Signup.jsx      # Signup page
    │   │   └── Dashboard.jsx   # Protected dashboard
    │   ├── services/
    │   │   └── authService.js  # Auth API calls
    │   ├── App.jsx             # Main app with routing
    │   └── index.css           # Tailwind styles
    ├── .env.example
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install djangorestframework djangorestframework-simplejwt psycopg2-binary python-decouple django-cors-headers
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE interior_design_db;
   CREATE USER postgres WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE interior_design_db TO postgres;
   ```

5. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DB_NAME=interior_design_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

6. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   The `.env` file should contain:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

## 🔌 API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup/` | User registration | No |
| POST | `/api/auth/login/` | User login | No |
| POST | `/api/auth/logout/` | User logout | Yes |
| GET | `/api/auth/profile/` | Get user profile | Yes |
| PATCH | `/api/auth/profile/` | Update user profile | Yes |
| POST | `/api/auth/token/refresh/` | Refresh access token | No |

### Request/Response Examples

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "created_at": "2026-05-12T10:30:00Z"
    },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

## 🎨 Frontend Features

### Authentication Flow
1. User visits the app → Redirected to login if not authenticated
2. User signs up/logs in → Tokens stored in localStorage
3. User navigates to protected routes → Token sent in Authorization header
4. Token expires → Automatically refreshed using refresh token
5. Refresh fails → User redirected to login

### UI Components
- **Glassmorphism cards** with backdrop blur
- **Gradient buttons** with hover effects
- **Responsive forms** with validation
- **Loading spinners** during API calls
- **Error messages** with proper styling
- **Dark mode** design throughout

## 🔒 Security Features

- Password hashing with Django's built-in system
- JWT tokens with configurable expiration
- Token blacklisting on logout
- CORS protection
- Input validation on both frontend and backend
- Protected routes requiring authentication
- Automatic token refresh
- Secure password validation rules

## 🧪 Testing the Application

1. **Start both servers** (backend on :8000, frontend on :5173)

2. **Test Signup:**
   - Navigate to `http://localhost:5173/signup`
   - Fill in the form and submit
   - Should redirect to dashboard on success

3. **Test Login:**
   - Navigate to `http://localhost:5173/login`
   - Use credentials from signup
   - Should redirect to dashboard on success

4. **Test Protected Routes:**
   - Try accessing `/dashboard` without logging in
   - Should redirect to login page

5. **Test Logout:**
   - Click logout button on dashboard
   - Should redirect to login page
   - Tokens should be cleared from localStorage

## 📝 Environment Variables

### Backend (.env)
```
DB_NAME=interior_design_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Next Steps

This authentication module provides the foundation for your AI Interior Design SaaS. You can now:

1. Add more protected routes and features
2. Implement password reset functionality
3. Add email verification
4. Create user profile editing
5. Add social authentication (Google, Facebook)
6. Implement role-based access control
7. Add the AI interior design features

## 📦 Dependencies

### Backend
- Django 5.1.7
- djangorestframework 3.16.1
- djangorestframework-simplejwt 5.5.1
- psycopg2-binary 2.9.12
- python-decouple 3.8
- django-cors-headers 4.9.0

### Frontend
- React 18.3.1
- Vite 6.0.11
- React Router DOM 7.6.2
- Axios 1.7.9
- Tailwind CSS 4.1.0

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for the AI Interior Design Platform
