# Backend Remote Lock

Backend API to remotely lock/unlock the **ProductionStatisticsManager** Electron application. Deployed on Vercel with MongoDB.

## Architecture

```
Electron App (startup) --> GET /api/lock/status --> Backend (Vercel)
                                                         |
Admin (curl/Postman)   --> POST /api/lock/lock   --------+-----> MongoDB
                       --> POST /api/lock/unlock ---------+
                       --> GET /api/lock/history ---------+
```

## API Endpoints

### Public (no authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lock/status` | Check lock status |
| `GET` | `/api/lock/status/:appId` | Check lock status for specific app |

### Admin (requires `X-API-Key` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/lock/lock` | Lock the application |
| `POST` | `/api/lock/unlock` | Unlock the application |
| `GET` | `/api/lock/history` | View lock/unlock history |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URL and API key
```

### 3. Run locally
```bash
npm run dev
```

### 4. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables on Vercel
vercel env add MONGODB_CONNECT_URL
vercel env add ADMIN_API_KEY
vercel env add CORS_ORIGIN
```

## Usage Examples

### Check status
```bash
curl https://your-app.vercel.app/api/lock/status
```

### Lock the application
```bash
curl -X POST https://your-app.vercel.app/api/lock/lock \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"reason": "Maintenance", "message": "He thong dang bao tri. Vui long thu lai sau."}'
```

### Unlock the application
```bash
curl -X POST https://your-app.vercel.app/api/lock/unlock \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key"
```

### View history
```bash
curl https://your-app.vercel.app/api/lock/history \
  -H "X-API-Key: your-api-key"
```

## Electron Integration

The `ProductionStatisticsManager` app checks the remote lock status on startup via `src/electron/services/remoteLock/remoteLockService.js`.

Update the API URL in `remoteLockService.js`:
```javascript
const REMOTE_LOCK_CONFIG = {
  apiUrl: "https://your-actual-vercel-url.vercel.app",
  // ...
};
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_CONNECT_URL` | MongoDB connection string | Yes |
| `ADMIN_API_KEY` | Secret key for admin operations | Yes |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | No (defaults to `*`) |
| `PORT` | Server port (local dev only) | No (defaults to `5001`) |
| `NODE_ENV` | Environment (`development`/`production`) | No |