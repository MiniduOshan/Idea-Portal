# Backend

Express and MongoDB API for the FishiFox Idea Portal.

## Endpoints

- `GET /api/health` - health check
- `GET /api/ideas` - list ideas
- `POST /api/ideas` - create an idea

## Run

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
1. Create `backend/.env` and set either `MONGO_URI` or `MONGODB_URI`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server:

```bash
npm run dev
```
The server connects to MongoDB before it starts listening. If the URI is wrong, startup will fail with a connection error.