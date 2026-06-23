# 🥗 NutriSnap: AI Nutrition Tracker & Meal Coach (Mobile)

> A modern **AI-powered nutrition tracking mobile application** built with **React Native (Expo) + TypeScript**, designed to help users log meals, understand nutrition intake, and receive personalized AI-driven meal coaching in real time.

NutriSnap demonstrates how **AI, mobile UX, and real-world health data workflows** can be combined to build a production-ready consumer application with strong scalability and user engagement patterns.

---

# ⚡ Working Demo (FastAPI + Claude)

This repo includes a **fully working backend and a minimal Expo client**:

* **FastAPI backend** (`backend/`) — JWT auth, SQLAlchemy (SQLite by default, Postgres-ready), meal logging, and local image storage, exposed as a REST API. Runs via `uvicorn` or `docker compose` (with Postgres).
* **AI nutrition analysis** — `POST /meals/analyze` sends meal photos to the **Claude API** (vision + structured JSON) for calorie/macro estimation
* **AI Meal Coach** — `GET /coach` asks **Claude** for personalized "what to eat next" guidance based on the day's logged meals and goals
* **Expo client** (`app/`) — React Native + TypeScript app: auth (+ one-tap demo), dashboard, camera→analyze→log flow, AI coach, and a goals editor

👉 **See [SETUP.md](SETUP.md)** for end-to-end setup, Docker/Postgres, and an API reference.

---

# 🚀 Quick Start

**1. Backend** — Python 3.11+, needs an `ANTHROPIC_API_KEY`:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate   •   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                 # set ANTHROPIC_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**2. App** — Node 18+, with Expo Go on your phone (or a simulator):

```bash
cd app
npm install
cp .env.example .env                 # set EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:8000
npx expo start
```

In the app, tap **⚡ Try the demo** (or sign up) → **Load sample meals**, or
**＋ Snap a meal** to run the Claude photo analysis. Sample photos live in
[test-images/](test-images/).

---

# 📱 Screenshots

<table>
  <tr>
    <td><img src="docs/screenshots/01-auth.svg" width="190" alt="Sign in / demo login"/></td>
    <td><img src="docs/screenshots/02-dashboard.svg" width="190" alt="Daily dashboard"/></td>
    <td><img src="docs/screenshots/03-analyze.svg" width="190" alt="AI photo analysis"/></td>
    <td><img src="docs/screenshots/04-coach.svg" width="190" alt="AI Meal Coach"/></td>
  </tr>
  <tr>
    <td align="center"><sub>Sign in / demo</sub></td>
    <td align="center"><sub>Daily dashboard</sub></td>
    <td align="center"><sub>AI photo analysis</sub></td>
    <td align="center"><sub>AI Meal Coach</sub></td>
  </tr>
</table>

> These are UI mockups using the app's real palette/layout. To swap in real
> device captures, see [docs/screenshots/](docs/screenshots/README.md).

# 🚀 Project Overview

NutriSnap is a mobile-first nutrition assistant that allows users to:

* 📸 Capture meals using camera or upload images
* 🧠 Automatically detect food items using AI
* 🔢 Estimate calories and macronutrients
* 📊 Track daily nutrition intake and goals
* 🤖 Receive AI-powered meal recommendations
* 📅 Maintain a daily/weekly health history

The app focuses on **simplicity for users** and **intelligence under the hood**, simulating a real-world consumer health product.

---

# 🎯 Key Objectives

This project was built to demonstrate:

* AI-native mobile app development workflows
* Practical use of LLMs in consumer applications
* Clean mobile architecture using React Native + TypeScript
* Scalable app structure suitable for production
* Real-world product thinking (health & wellness domain)
* Fast iteration using AI-assisted development tools

---

# 🧠 Core Features

## 📸 1. Smart Meal Capture

Users can:

* Take a photo of food
* Upload an image from gallery

The system then:

* Detects food items
* Classifies meal type
* Sends data to AI nutrition engine

---

## 🤖 2. AI Nutrition Analysis Engine

The AI layer processes input and returns:

* Food identification (multi-item detection)
* Estimated calories
* Protein / carbs / fat breakdown
* Health score (balanced meal indicator)

> Powered by LLM + structured prompt engineering for nutrition estimation

---

## 📊 3. Daily Nutrition Dashboard

* Calorie progress bar
* Macro breakdown visualization
* Meal timeline (breakfast, lunch, dinner, snacks)
* Goal tracking (weight loss / maintenance / gain)

---

## 🍽️ 4. AI Meal Coach

Users receive:

* Personalized meal suggestions
* Health improvement tips
* “What should I eat next?” recommendations
* Smart substitutions (e.g., healthier alternatives)

---

## 📅 5. History & Insights _(planned)_

> 🚧 Not yet implemented — on the roadmap (today's totals + history are tracked
> per user in the backend; trend views are future work).

* Daily / weekly / monthly tracking
* Nutrition trend analysis
* Habit insights (e.g., high sugar intake patterns)
* Exportable summaries

---

# 🏗️ System Architecture

```text id="nutrisnap-arch"
┌──────────────────────────────────────┐
│  Expo App  (React Native + TypeScript)│
│  Auth · Dashboard · Camera/Analyze    │
│  AI Coach · Goals                     │
│  AuthContext · services · theme       │
└───────────────────┬──────────────────┘
                    │  REST + JWT (fetch)
                    ▼
┌──────────────────────────────────────┐
│  FastAPI backend                      │
│  /auth   /profile   /meals            │
│  /meals/analyze     /coach            │
│  SQLAlchemy ──► SQLite (or Postgres)  │
│  /uploads  (meal photos on disk)      │
└───────────────────┬──────────────────┘
                    │  HTTPS — vision + structured JSON
                    ▼
        Claude API (Anthropic)
   photo → nutrition · day → coaching
```

---

# ⚙️ Tech Stack

## 📱 Mobile (`app/`)

* React Native (Expo SDK 56) + TypeScript
* React Navigation (native stack)
* expo-image-picker (camera & gallery)
* expo-linear-gradient + @expo/vector-icons (themed UI)
* AsyncStorage (JWT persistence)

## 🗄️ Backend (`backend/`)

* FastAPI + Uvicorn (REST API)
* SQLAlchemy ORM → SQLite (default) or Postgres
* JWT auth (PyJWT) + bcrypt password hashing
* Local image storage; Docker + docker-compose

## 🧠 AI (Claude)

* Anthropic **Claude** with **vision** for meal-photo analysis
* **Structured JSON outputs** (`json_schema`) — predictable, parse-safe
* AI Meal Coach for personalized daily guidance

## 🎨 UI / UX

* Health-forward emerald → teal gradient theme
* Elevated, card-based dashboard with themed dialogs
* Minimal-friction, one-tap meal logging

---

# 🧱 Project Structure

```text id="nutrisnap-structure"
NutriSnap/
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py               # app, CORS, static /uploads, routers
│   │   ├── config.py  database.py  models.py  schemas.py
│   │   ├── auth.py               # JWT + bcrypt + current-user dependency
│   │   ├── ai.py                 # Claude: photo analysis + meal coach
│   │   ├── utils.py              # image storage + serialization
│   │   └── routers/             # auth · profile · meals · coach
│   ├── requirements.txt
│   └── Dockerfile
│
├── app/                          # Expo (React Native + TypeScript) client
│   ├── App.tsx
│   └── src/
│       ├── lib/api.ts            # REST client + JWT storage
│       ├── context/AuthContext.tsx
│       ├── services/meals.ts     # profile · meals · analyze · coach
│       ├── components/           # GradientButton, AppDialog, MealCard, …
│       ├── screens/              # Auth, Dashboard, AddMeal, MealDetail,
│       │                         #   Coach, Profile
│       └── theme.ts              # design system (colors, gradients, shadows)
│
├── docker-compose.yml            # backend + Postgres in one command
├── test-images/                  # sample meal photos for testing
└── docs/screenshots/
```

---

# 🧠 AI Design Approach

NutriSnap uses **structured AI outputs** instead of raw text.

### Example AI Output Schema:

```json id="ai-schema"
{
  "name": "Chicken Rice Bowl",
  "meal_type": "lunch",
  "calories": 620,
  "protein_g": 42,
  "carbs_g": 65,
  "fat_g": 18,
  "health_score": 8,
  "recommendation": "Add more greens for fiber balance.",
  "items": ["Grilled chicken", "White rice", "Avocado", "Corn"]
}
```

> Enforced server-side via Claude's `json_schema` structured output — the app
> can render it directly with no fragile text parsing.

This ensures:

* Predictable UI rendering
* Safe data parsing
* Scalable AI integration

---

# 🔐 Key Design Principles

## 1. Mobile-first simplicity

* One-tap meal logging
* Minimal user friction

## 2. AI as a co-pilot, not a replacement

* Users stay in control
* AI provides suggestions, not commands

## 3. Structured intelligence

* All AI outputs are schema-driven
* No free-text dependency in UI layer

## 4. Secure & polished by default

* Per-user data isolated behind JWT auth
* Health-forward gradient theme with consistent, accessible dialogs

---

# 📈 Scalability Considerations

* Backend-ready modular architecture
* API abstraction for AI providers
* Future support for:

  * wearable integration (Apple Health / Google Fit)
  * barcode scanning
  * subscription-based meal plans
  * personalized nutrition models

---

# 🤖 AI Usage in Development

This project was accelerated using AI-assisted workflows:

* UI scaffolding via AI tools
* Prompt engineering for nutrition logic
* API response structuring
* Rapid iteration of mobile screens
* Automated documentation generation

---

# 🧪 Future Improvements

* Food barcode scanning
* Real-time object detection (on-device ML)
* Personalized diet plans (AI coach evolution)
* Social features (meal sharing)
* Gamification (streaks, badges)
* Integration with fitness tracking APIs

---
