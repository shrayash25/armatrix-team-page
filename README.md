# Armatrix Team Page

A production-quality full-stack **Team Page** for the Armatrix robotics startup — featuring a FastAPI backend, Next.js frontend, and a clean REST API.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Tech Stack](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

---

## Architecture

```
┌──────────────┐     REST API     ┌──────────────┐
│              │ ◄──────────────► │              │
│   Next.js    │   JSON / HTTP    │   FastAPI    │
│   Frontend   │                  │   Backend    │
│  (Port 3000) │                  │  (Port 8000) │
└──────────────┘                  └──────┬───────┘
                                         │
                                    ┌────▼────┐
                                    │ SQLite  │
                                    │ team.db │
                                    └─────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python · FastAPI · SQLModel · SQLite |
| Frontend | Next.js (App Router) · React · TypeScript · TailwindCSS · Framer Motion |
| Deployment | Vercel (frontend) · Render / Railway (backend) |

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API available at `http://localhost:8000` — Swagger docs at `/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:3000/team`.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/team` | List all team members |
| `GET` | `/team/{id}` | Get a single member |
| `POST` | `/team` | Create a new member |
| `PUT` | `/team/{id}` | Update a member |
| `DELETE` | `/team/{id}` | Delete a member |

### Example: Create a member

```bash
curl -X POST http://localhost:8000/team/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "role": "Software Engineer",
    "department": "Engineering",
    "bio": "Full-stack developer with 5 years of experience.",
    "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=jane",
    "linkedin_url": "https://linkedin.com/in/janedoe"
  }'
```

## Deployment

### Frontend → Vercel

1. Push repo to GitHub
2. Import in Vercel
3. Set env variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

### Backend → Render

1. Create a new Web Service
2. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
3. Set root directory: `backend`

## Project Structure

```
armatrix-team-page/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # SQLite engine & sessions
│   │   ├── models.py        # SQLModel table definitions
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── crud.py          # CRUD operations
│   │   └── routes/
│   │       └── team.py      # REST API endpoints
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── team/page.tsx     # Team page (hero + grid + modal)
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Dark theme styles
│   ├── components/
│   │   ├── TeamCard.tsx      # Individual team member card
│   │   ├── TeamGrid.tsx      # Responsive grid layout
│   │   ├── TeamModal.tsx     # Profile detail modal
│   │   └── DepartmentFilter.tsx
│   └── lib/
│       └── api.ts            # Typed API helper
│
├── chat-context/
│   └── interaction-log.md    # Development journal
│
└── README.md
```

## License

Private – Armatrix Robotics.
