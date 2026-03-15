# Armatrix Team API – Backend

FastAPI-powered REST API serving team member data for the Armatrix robotics startup website.

## Quick Start

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs at `http://localhost:8000/docs`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/team` | List all team members |
| GET | `/team/{id}` | Get a single member |
| POST | `/team` | Create a new member |
| PUT | `/team/{id}` | Update a member |
| DELETE | `/team/{id}` | Delete a member |

## Deployment

```bash
uvicorn app.main:app --host 0.0.0.0 --port 10000
```
