# Setup Guide - AI Chat Platform

## Quick Start

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

**Frontend** (create `frontend/.env`):
```
VITE_API_URL=http://localhost:3001
```

**Backend** (create `backend/.env`):
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

### Backend
```bash
cd backend
npm run build
npm start
```

The production build will be in `backend/dist/`

## Project Structure

```
ai-assistant/
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Backend Express server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Security middleware
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Security Checklist

- [ ] Update CORS settings in `backend/src/index.ts` for production domain
- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Use HTTPS in production
- [ ] Configure proper rate limits
- [ ] Review and update security headers
- [ ] Set up proper logging and monitoring

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify `.env` file exists in `backend/` directory
- Check Node.js version (requires 18+)

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `VITE_API_URL` in `frontend/.env`
- Check CORS settings in backend

### API errors
- Verify API keys are correct
- Check rate limits haven't been exceeded
- Review backend logs for detailed errors

## Development Tips

- Both frontend and backend have separate `node_modules` directories
- Each can be developed and run independently
- Frontend proxies API requests to backend during development
- Use separate terminals for frontend and backend development
