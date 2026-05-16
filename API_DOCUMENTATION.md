# 🔌 API Documentation

Complete API reference for the Interior Design Portal Authentication System.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

---

## Endpoints

### 1. User Signup

Create a new user account.

**Endpoint:** `POST /auth/signup/`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format, must be unique
- `password`: Required, minimum 8 characters, must pass Django password validation
- `password_confirm`: Required, must match password

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "created_at": "2026-05-12T10:30:00.000000Z"
    },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Registration failed",
  "errors": {
    "email": ["This email is already registered."],
    "password": ["This password is too common."]
  }
}
```

---

### 2. User Login

Authenticate a user and receive JWT tokens.

**Endpoint:** `POST /auth/login/`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "created_at": "2026-05-12T10:30:00.000000Z"
    },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

**Error Responses:**

Invalid credentials (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Account disabled (403 Forbidden):
```json
{
  "success": false,
  "message": "Account is disabled"
}
```

---

### 3. Token Refresh

Get a new access token using a refresh token.

**Endpoint:** `POST /auth/token/refresh/`

**Authentication:** Not required (but needs refresh token)

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token refresh failed",
  "errors": {
    "detail": "Token is invalid or expired",
    "code": "token_not_valid"
  }
}
```

---

### 4. Get User Profile

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /auth/profile/`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "created_at": "2026-05-12T10:30:00.000000Z",
    "updated_at": "2026-05-12T10:30:00.000000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 5. Update User Profile

Update the authenticated user's profile information.

**Endpoint:** `PATCH /auth/profile/`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Updated Doe"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Updated Doe",
    "created_at": "2026-05-12T10:30:00.000000Z",
    "updated_at": "2026-05-12T15:45:00.000000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Update failed",
  "errors": {
    "name": ["This field may not be blank."]
  }
}
```

---

### 6. User Logout

Logout the user and blacklist the refresh token.

**Endpoint:** `POST /auth/logout/`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Logout failed",
  "error": "Token is invalid or expired"
}
```

---

## JWT Token Details

### Access Token
- **Lifetime:** 1 hour
- **Purpose:** Authenticate API requests
- **Storage:** localStorage (frontend)
- **Header Format:** `Authorization: Bearer <access_token>`

### Refresh Token
- **Lifetime:** 7 days
- **Purpose:** Obtain new access tokens
- **Storage:** localStorage (frontend)
- **Rotation:** New refresh token issued on each refresh
- **Blacklisting:** Old tokens are blacklisted after rotation

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Account disabled |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider adding:
- Rate limiting per IP address
- Rate limiting per user account
- Throttling for authentication endpoints

---

## CORS Configuration

The API allows requests from:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Allowed methods:
- GET, POST, PUT, PATCH, DELETE, OPTIONS

Allowed headers:
- accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with

---

## Example Usage

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Signup
const signup = async (userData) => {
  const response = await api.post('/auth/signup/', userData);
  return response.data;
};

// Login
const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  const { tokens } = response.data.data;
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
  return response.data;
};

// Get Profile (with auth)
const getProfile = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await api.get('/auth/profile/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Python (Requests)

```python
import requests

BASE_URL = 'http://localhost:8000/api'

# Signup
def signup(user_data):
    response = requests.post(f'{BASE_URL}/auth/signup/', json=user_data)
    return response.json()

# Login
def login(credentials):
    response = requests.post(f'{BASE_URL}/auth/login/', json=credentials)
    data = response.json()
    return data['data']['tokens']

# Get Profile (with auth)
def get_profile(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(f'{BASE_URL}/auth/profile/', headers=headers)
    return response.json()
```

### cURL

```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get Profile
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update Profile
curl -X PATCH http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'

# Logout
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (httpOnly cookies preferred over localStorage)
3. **Implement rate limiting** to prevent brute force attacks
4. **Add CSRF protection** for state-changing operations
5. **Validate all inputs** on both frontend and backend
6. **Use strong password policies**
7. **Implement account lockout** after failed login attempts
8. **Add email verification** for new accounts
9. **Log authentication events** for security monitoring
10. **Regularly rotate JWT secret keys**

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with `BASE_URL` variable
3. Use Tests tab to automatically save tokens:

```javascript
// In Login request Tests tab
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.data.tokens.access);
    pm.environment.set("refresh_token", response.data.tokens.refresh);
}
```

4. Use `{{access_token}}` in Authorization header for protected endpoints

---

## Changelog

### Version 1.0.0 (2026-05-12)
- Initial release
- User signup, login, logout
- JWT authentication
- User profile management
- Token refresh mechanism
- Token blacklisting

---

## Support

For issues or questions:
- Check the [README](README.md)
- Review the [Quick Start Guide](QUICKSTART.md)
- Open an issue on GitHub

---

**Last Updated:** May 12, 2026
