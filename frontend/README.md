# Interior Design AI - Frontend

A modern React application for AI-powered interior design generation.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **AI Design Generator**: Upload room images and generate AI-powered interior designs
- **Design Gallery**: View and manage your generated designs
- **Responsive UI**: Beautiful, modern interface with Tailwind CSS
- **Protected Routes**: Secure access to authenticated features

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS v4** - Styling
- **Context API** - State management

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── components/
│   ├── DesignCard.jsx        # Display generated designs
│   ├── Loader.jsx            # Loading spinner component
│   ├── Navbar.jsx            # Navigation bar
│   ├── ProtectedRoute.jsx    # Route protection wrapper
│   └── UploadRoom.jsx        # Image upload and prompt form
├── context/
│   ├── AuthContext.js        # Auth context definition
│   ├── AuthContext.jsx       # Auth provider implementation
│   └── useAuth.js            # Auth hook
├── pages/
│   ├── AIDesign.jsx          # AI design generation page
│   ├── Dashboard.jsx         # User dashboard
│   ├── Login.jsx             # Login page
│   └── Signup.jsx            # Signup page
├── services/
│   ├── authService.js        # Authentication API calls
│   └── designService.js      # Design generation API calls
├── App.jsx                   # Main app component with routes
├── main.jsx                  # App entry point
└── index.css                 # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Features Overview

### Authentication

- JWT-based authentication with access and refresh tokens
- Automatic token refresh on expiration
- Persistent login state with localStorage
- Protected routes for authenticated users

### AI Design Generation

1. **Upload Image**: Drag and drop or click to upload room images
2. **Enter Prompt**: Describe your desired interior design style
3. **Generate**: AI processes the image and generates a new design
4. **View Results**: Compare original and AI-generated designs side by side
5. **Download**: Save generated designs to your device

### Components

#### UploadRoom
- Image upload with drag-and-drop support
- File validation (type and size)
- Image preview
- Prompt input with suggestions
- Form validation

#### DesignCard
- Display original and generated images
- Toggle between original and AI design
- Download functionality
- Timestamp display

#### Navbar
- Brand logo and navigation
- User profile display
- Logout functionality
- Responsive design

## API Integration

### Authentication Endpoints
- `POST /api/auth/signup/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile
- `POST /api/auth/token/refresh/` - Refresh access token

### Design Endpoints
- `POST /api/design/generate/` - Generate AI design
  - Body: `FormData` with `image` (file) and `prompt` (string)
  - Returns: Design object with original and generated image URLs

## Styling

The app uses Tailwind CSS v4 with custom utility classes:

- `.glass-effect` - Glassmorphism effect for cards
- `.gradient-button` - Gradient button with hover effects
- `.input-field` - Styled form inputs
- `.auth-container` - Authentication page container
- `.auth-card` - Authentication form card

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8000/api`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use functional components with hooks
3. Keep components small and focused
4. Add proper error handling
5. Test responsive design

## License

MIT
