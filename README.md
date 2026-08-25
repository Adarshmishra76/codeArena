# CodeArena

CodeArena is a full-stack competitive programming platform, similar in spirit to LeetCode. Users can browse coding problems, write and run code in an in-browser editor, submit solutions for judging, track their progress, get AI-powered help when stuck, and watch editorial videos — while admins manage problems and video content from an admin panel.

## Features

- **User authentication** — signup/login/logout with JWT-based auth stored in cookies, plus profile deletion
- **Role-based access** — separate user and admin permissions, with admin-only routes for managing content
- **Problem management** — create, update, delete, and browse coding problems, with filtering, search, and pagination
- **Code editor** — in-browser code editing powered by Monaco Editor
- **Code execution & submission** — run and submit code against test cases via the Piston code execution API
- **Submission history** — track a user's past submissions and solved problems per problem
- **AI doubt-solving chat** — ask an AI assistant (Google Gemini) for help on a problem
- **Editorial videos** — admins upload solution videos (via Cloudinary); users can watch editorials for solved problems
- **Admin panel** — dedicated UI for creating/updating/deleting problems and managing videos

## Tech Stack

**Frontend** (`/frontend`)
- React 19 + Vite
- Redux Toolkit / React Redux for state management
- React Router for routing
- React Hook Form + Zod for form handling and validation
- Tailwind CSS + DaisyUI for styling
- Monaco Editor for the code editor
- Axios for API requests

**Backend** (`/backend`)
- Node.js + Express 5
- MongoDB with Mongoose
- Redis (used for things like token/session/blacklist handling)
- JWT (`jsonwebtoken`) + `bcrypt` for authentication
- Cloudinary for video/media storage
- Google Gemini API (`@google/genai`) for the AI doubt-solving feature
- Piston API for running/judging submitted code
- Dockerfile included for containerized deployment

## Project Structure

```
CodeArena/
├── backend/
│   ├── src/
│   │   ├── config/          # DB and Redis connection setup
│   │   ├── controllers/     # Route handlers (auth, problems, submissions, AI, videos)
│   │   ├── middleware/      # User and admin auth middleware
│   │   ├── models/          # Mongoose schemas (user, problem, submission, solutionVideo)
│   │   ├── routes/          # Express routers
│   │   ├── utils/           # Helper utilities (validators, problem utility)
│   │   ├── index.js         # App entry point
│   │   └── Dockerfile
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components (Navbar, Sidebar, ProblemList, ChatAi, etc.)
    │   ├── pages/            # Route-level pages (Homepage, Problems, ProblemPage, Login, Signup, Admin)
    │   ├── store/             # Redux store setup
    │   ├── utils/             # Axios client, etc.
    │   └── main.jsx / App.jsx
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB instance (local or hosted)
- Redis instance
- Accounts/API keys for: Cloudinary, Google Gemini, and a Piston code-execution endpoint

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```
PORT=3000
DB_CONNECT_STRING=<your MongoDB connection string>
JWT_KEY=<your JWT secret>
REDIS_PASS=<your Redis password>
PISTON_URL=<Piston code execution API URL>
GEMINI_KEY=<your Google Gemini API key>
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

Run the backend:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

The server listens on the port defined by `PORT` (defaults to 3000).

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

By default the Vite dev server runs on `http://localhost:5173`, which is the origin currently allowed by the backend's CORS configuration. For production builds, `VITE_API_URL` (see `.env.production`) controls the API base path.

```bash
npm run build     # production build
npm run preview   # preview the production build
```

## API Overview

| Base Route     | Purpose                                              |
|-----------------|-------------------------------------------------------|
| `/user`         | Register, login, logout, admin registration, profile |
| `/problem`      | Create, update, delete, fetch, and list problems      |
| `/submission`   | Run and submit code for a problem                     |
| `/ai`           | AI-powered doubt-solving chat                          |
| `/video`        | Upload signatures, save, and delete editorial videos  |

Most routes are protected by user authentication middleware; problem/video creation, updates, and deletion are restricted to admins.

## Notes

- Never commit real `.env` values — the variable names above are a template, not actual credentials.
- The backend degrades gracefully if Redis is unavailable at startup and will retry the connection in the background.
