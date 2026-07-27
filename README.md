# TaskTrack — Full-Stack Task Manager

A secured REST API (Node/Express/MongoDB) with a React frontend. Users register,
log in, and manage their own tasks (title, description, status, due date).
All task routes are protected by JWT auth and scoped to the logged-in user.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs
- **Frontend:** React (Vite), React Router, native `fetch` API
- **Auth:** JSON Web Tokens, hashed passwords (bcrypt, 10 salt rounds)

## Project Structure
```
TaskTrack/
├── backend/               # Express API
│   ├── config/db.js       # MongoDB connection
│   ├── models/            # Mongoose schemas (User, Task)
│   ├── controllers/       # Route logic
│   ├── routes/            # Route definitions
│   ├── middleware/        # auth.js (JWT check), errorHandler.js
│   └── server.js          # App entry point
└── frontend/              # React frontend
    └── src/
        ├── api/api.js          # fetch wrapper with JWT header + error handling
        ├── context/             # AuthContext (login/register/logout state)
        ├── pages/               # Login, Register, Tasks
        └── components/          # TaskForm, TaskItem, PrivateRoute
```

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
cp .env   # fill in your own values, see table below
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env   # set VITE_API_URL if your API isn't on localhost:5000
npm run dev              # starts on http://localhost:5173
```

### 3. MongoDB Atlas
1. Create a free (M0) cluster at https://www.mongodb.com/cloud/atlas
2. Under **Database Access**, create a database user (username + password).
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for dev/deploy simplicity.
4. Click **Connect → Drivers**, copy the connection string into `backend/.env` as `MONGO_URI`
   (replace `<username>` and `<password>` with your actual DB user credentials).

## Environment Variables

**backend/.env**
| Variable     | Description                                  |
|--------------|-----------------------------------------------|
| `PORT`       | Port the API runs on (default 5000)           |
| `MONGO_URI`  | MongoDB Atlas connection string               |
| `JWT_SECRET` | Long random string used to sign JWTs          |

**frontend/.env**
| Variable        | Description                                |
|-----------------|---------------------------------------------|
| `VITE_API_URL`  | Base URL of the API, e.g. `http://localhost:5000/api` |

## API Documentation

Base URL: `/api`

### Auth
| Method | Endpoint         | Body                              | Auth | Description            |
|--------|------------------|------------------------------------|------|-------------------------|
| POST   | `/auth/register` | `{ name, email, password }`        | No   | Create account, returns `{ token, user }` |
| POST   | `/auth/login`    | `{ email, password }`              | No   | Log in, returns `{ token, user }` |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint      | Body                                              | Description                |
|--------|---------------|----------------------------------------------------|------------------------------|
| GET    | `/tasks`      | —                                                    | List the logged-in user's tasks |
| GET    | `/tasks/:id`  | —                                                    | Get a single task            |
| POST   | `/tasks`      | `{ title, description?, status?, dueDate? }`         | Create a task                |
| PUT    | `/tasks/:id`  | any subset of the fields above                      | Update a task                |
| DELETE | `/tasks/:id`  | —                                                    | Delete a task                |

`status` is one of: `pending`, `in-progress`, `completed`.

### Error format
All errors return JSON: `{ "message": "..." }` with an appropriate HTTP status
(400 validation, 401 unauthorized, 404 not found, 409 conflict, 500 server error).

## Deployment
- **Backend:** Render (Web Service) — root directory `backend`, build `npm install`,
  start `npm start`, set `PORT`, `MONGO_URI`, `JWT_SECRET` as env vars in Render's dashboard.
- **Frontend:** Render (Static Site) or Vercel — root directory `frontend`,
  build `npm run build`, publish directory `dist`, set `VITE_API_URL` to your
  deployed backend's `/api` URL (e.g. `https://tasktrack-api.onrender.com/api`).

## Scripts
| Location  | Command         | Purpose                       |
|-----------|-----------------|--------------------------------|
| backend/  | `npm run dev`   | Start API with auto-reload (`node --watch`) |
| backend/  | `npm start`     | Start API (production)         |
| frontend/ | `npm run dev`   | Start frontend dev server       |
| frontend/ | `npm run build` | Build frontend for production   |