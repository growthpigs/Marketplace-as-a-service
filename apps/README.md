# TurkEats - Application Suite

## Structure

```
apps/
├── mobile/                 # React Native + Expo (Customer App)
├── api/                    # NestJS Backend API
└── restaurant-dashboard/   # Next.js Restaurant Dashboard
```

## Quick Start

### Mobile App (Expo)
```bash
cd apps/mobile
npm start
# Scan QR code with Expo Go app
```

### Backend API
```bash
cd apps/api
npm run start:dev
# API runs at http://localhost:3000
```

### Restaurant Dashboard
```bash
cd apps/restaurant-dashboard
npm run dev
# Dashboard runs at http://localhost:3001
```

## Tech Stack

| App | Framework | Language |
|-----|-----------|----------|
| Mobile | Expo SDK 52 | TypeScript |
| API | NestJS 10 | TypeScript |
| Dashboard | Next.js 14 | TypeScript |

## Shared

All apps use TypeScript for consistent type safety across the stack.
