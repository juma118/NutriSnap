# 🛠️ NutriSnap — Setup & Run Guide

This guide takes you from an empty machine to a **fully working demo**: a FastAPI
backend (auth + database + AI nutrition endpoint + image storage) and a minimal
Expo client that talks to it.

```
Expo app (React Native + TS)
   │  REST + JWT  (fetch)
   ▼
FastAPI backend
   ├── /auth      →  signup / login (JWT)
   ├── /profile   →  daily goals
   ├── /meals     →  list / log / delete / demo-seed
   ├── /meals/analyze ──HTTPS──▶  Claude API (vision + structured JSON)
   ├── SQLite (SQLAlchemy)  →  users, meals
   └── /uploads   →  meal photos (local file storage)
```

---

## 0. Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- An **Anthropic API key** — https://console.anthropic.com (`sk-ant-...`)
- The **Expo Go** app on your phone (or an Android/iOS simulator)

---

## 1. Run the FastAPI backend

```bash
cd backend

# Create a virtual environment
python -m venv .venv
# Windows:        .venv\Scripts\activate
# macOS / Linux:  source .venv/bin/activate

pip install -r requirements.txt

# Configure secrets
cp .env.example .env
#   ANTHROPIC_API_KEY=sk-ant-...        (required for AI analysis)
#   SECRET_KEY=<a long random string>   (signs JWT tokens)

# Start the server (0.0.0.0 so your phone can reach it over the LAN)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Now visit **http://localhost:8000/docs** for interactive API docs (Swagger).
The SQLite database (`nutrisnap.db`) and `uploads/` folder are created
automatically on first run.

> Find your computer's **LAN IP** (e.g. `192.168.1.20`) — the phone needs it in
> the next step. `ipconfig` (Windows) / `ifconfig` / `ipconfig getifaddr en0` (macOS).

---

## 2. Run the Expo client

```bash
cd app
npm install

cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend, reachable from the device:
#   Physical phone (Expo Go):  http://<your-LAN-IP>:8000
#   Android emulator:          http://10.0.2.2:8000
#   iOS simulator:             http://localhost:8000

npx expo start
```

Scan the QR code with **Expo Go**, or press `a` / `i` for a simulator.

> If a dependency-version warning appears, run `npx expo install` to align
> packages with your installed Expo SDK.

---

## Alternative: run the backend with Docker + Postgres

Instead of step 1, you can run the backend (on Postgres) with one command:

```bash
cp backend/.env.example backend/.env     # set ANTHROPIC_API_KEY + SECRET_KEY
docker compose up --build
```

This starts Postgres and the API together; the API is on `http://localhost:8000`
(use your LAN IP for a phone). Tables are created automatically on startup.

> **Database:** SQLite is the zero-config default for local `uvicorn`. To use
> Postgres without Docker, set `DATABASE_URL=postgresql+psycopg://user:pass@host:5432/db`
> in `backend/.env` — the SQLAlchemy models are identical. (Schema is created via
> `create_all` on startup; Alembic migrations are a natural next step but not
> included.)

---

## 3. Demo the full flow

1. **Sign in** — tap **⚡ Try the demo** for a one-tap shared demo account, or
   **Sign up** with any email + password (a user is created with default daily
   goals; the JWT is stored on the device).
2. On the empty dashboard, tap **Load sample meals** to see the tracking UI, or…
3. Tap **＋ Snap a meal** → take/choose a food photo → **Analyze nutrition**.
   The backend calls Claude and returns calories, macros, a health score,
   detected items, and a coaching tip.
4. **Save to log** → the photo is uploaded to the backend and the meal appears on
   the dashboard, updating your calorie + macro progress.
5. Tap **🍽️ Ask the AI coach** → Claude reviews the day's meals vs. your goals and
   returns a headline, tips, and a "what to eat next" suggestion.
6. Tap **⚙︎ Goals** to edit your goal (lose/maintain/gain) and daily targets.
7. Tap a meal to view details (with the photo) or delete it.

Every endpoint is scoped to the authenticated user — you only ever see your own
profile, meals, and images.

---

## Project layout

```
NutriSnap/
├── docker-compose.yml             # backend + Postgres in one command
├── backend/                       # FastAPI backend
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── app/
│       ├── main.py                # app, CORS, static /uploads, routers
│       ├── config.py              # settings from .env
│       ├── database.py            # SQLAlchemy engine/session (SQLite/Postgres)
│       ├── models.py              # User, Meal
│       ├── schemas.py             # Pydantic request/response models
│       ├── auth.py                # bcrypt hashing + JWT + current-user dep
│       ├── ai.py                  # Claude: vision analysis + meal coach
│       ├── utils.py               # image storage + serialization
│       └── routers/               # auth, profile, meals, coach
└── app/                           # Expo (React Native + TypeScript) client
    ├── App.tsx
    └── src/
        ├── lib/api.ts             # REST client + JWT token storage
        ├── context/AuthContext.tsx
        ├── services/meals.ts      # API calls (profile, meals, analyze, coach)
        ├── components/            # ProgressBar, MacroBar, MealCard
        └── screens/               # Auth, Dashboard, AddMeal, MealDetail,
                                    #   Coach, Profile
```

---

## API reference (quick)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | – | Create account → `{ access_token, user }` |
| POST | `/auth/login` | – | Log in → `{ access_token, user }` |
| GET | `/auth/me` | ✅ | Current user |
| GET | `/profile` | ✅ | Daily goals |
| PUT | `/profile` | ✅ | Update goals |
| GET | `/meals?since=<iso>` | ✅ | Meals since a timestamp |
| POST | `/meals/analyze` | ✅ | AI-analyze a base64 photo (Claude vision) |
| POST | `/meals` | ✅ | Log a meal (optionally with photo) |
| DELETE | `/meals/{id}` | ✅ | Delete a meal |
| POST | `/meals/demo-seed` | ✅ | Insert sample meals |
| GET | `/coach` | ✅ | AI Meal Coach advice for the day (Claude) |

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Missing EXPO_PUBLIC_API_URL` on app start | `app/.env` not set; copy from `.env.example` and restart `expo start`. |
| App can't reach the backend / network error | Use your LAN IP (not `localhost`) in `EXPO_PUBLIC_API_URL`, and start uvicorn with `--host 0.0.0.0`. Phone and computer must be on the same network. |
| `/meals/analyze` returns 500 "missing ANTHROPIC_API_KEY" | Set `ANTHROPIC_API_KEY` in `backend/.env` and restart uvicorn. |
| 401 on protected endpoints | Sign in again; the JWT may have expired (default 7 days). |
| Photos don't display | The app builds image URLs from `EXPO_PUBLIC_API_URL`; make sure that host is reachable from the device. |
