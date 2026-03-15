# Armatrix Team Page – Frontend

Next.js (App Router) frontend for the Armatrix team page.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## Key Components

- **`TeamCard`** – Animated member card with hover effects
- **`TeamGrid`** – Responsive 4/2/1 column grid
- **`TeamModal`** – Click-to-expand profile modal
- **`DepartmentFilter`** – Pill-style filter buttons

## Deployment (Vercel)

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
