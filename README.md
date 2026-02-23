# Per Diem

A menu browsing app built on Square's Catalog API. Pick a location, browse the menu, filter by category, search for items.

## What's in the box

- **Backend**: Express 5 + TypeScript API that talks to Square
- **Frontend**: React 19 SPA with MobX state management
- **Caching**: Redis (or in-memory fallback) to avoid hammering Square's API
- **Docker**: Full docker-compose setup for easy deployment
- **Tests**: Jest for backend, Vitest for frontend

## Quick Start

### Prerequisites

- Node.js 18+
- Square Developer account ([get one here](https://developer.squareup.com/apps))
- Docker (optional, for containerized setup)

### Option 1: Run locally

```bash
# Backend
cd backend
npm install
cp .env.example .env  # then add your Square token
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Backend: http://localhost:4000  
Frontend: http://localhost:5173

### Option 2: Docker

```bash
# Add your Square token to backend/.env first
docker-compose up --build
```

Frontend: http://localhost (port 80)  
Backend: http://localhost:4000

## Environment Variables

Create `backend/.env`:

```env
PORT=4000
SQUARE_ACCESS_TOKEN=your_token_here
SQUARE_ENVIRONMENT=sandbox
REDIS_URL=redis://localhost:6379  # optional, uses memory cache if not set
```

## API Endpoints

| Endpoint | What it does |
|----------|--------------|
| `GET /api/locations` | List all store locations |
| `GET /api/catalog?location_id=X` | Menu items grouped by category |
| `GET /api/catalog/categories?location_id=X` | Category list with item counts |

## Running Tests

```bash
# Backend
cd backend
npm test
npm run test:coverage

# Frontend
cd frontend
npm test
npm run test:coverage
```

---

## Features Implemented

### Core Requirements
- [x] **Location selector** - Pick from available Square locations
- [x] **Menu display** - Shows items with images, descriptions, prices
- [x] **Category filtering** - Horizontal scrollable category bar
- [x] **Search** - Filter items by name within current view
- [x] **Responsive design** - Works on mobile, tablet, desktop

### Bonus Features
- [x] **Dark mode** - Toggle in navbar, persists to localStorage
- [x] **Caching layer** - Redis with in-memory fallback, 5-min TTL
- [x] **Loading skeletons** - Smooth loading states instead of spinners
- [x] **Error handling** - Graceful errors with retry buttons
- [x] **Accessibility** - ARIA labels, keyboard navigation, focus states
- [x] **Docker support** - Full docker-compose with nginx frontend
- [x] **Unit tests** - Store tests (frontend), service/controller tests (backend)
- [x] **Integration tests** - API endpoint tests with mocked Square client

---

## Architecture Decisions

### Why MobX over Redux?
Less boilerplate. For an app this size, MobX's simplicity wins. Stores are just classes with observable properties. No action creators, reducers, or middleware setup.

### Why in-memory cache fallback?
Not everyone wants to spin up Redis for local dev. The cache interface is the same either way, so you get the same behavior. Redis is there when you need it for production.

### Why Express 5?
It's stable now and has better async error handling out of the box. No need for express-async-handler wrappers.

### Why Tailwind 4?
CSS variables for theming, no config file needed, faster builds. The new `@theme` directive makes dark mode trivial.

### Frontend state architecture
Three stores, single responsibility:
- `locationStore` - fetches and holds locations
- `catalogStore` - catalog data, filtering, search
- `themeStore` - dark/light mode

Selected location lives in localStorage so it survives page refreshes.

### Backend structure
Classic layered architecture:
- **Controllers** - handle HTTP, validate params, return responses
- **Services** - business logic, talk to Square SDK
- **Utils** - caching, shared helpers

---

## Trade-offs & Limitations

### Things I'd do differently with more time

1. **No pagination** - Currently loads entire catalog. Fine for small menus, would need cursor-based pagination for large catalogs (100+ items).

2. **No image optimization** - Using Square's image URLs directly. Could add a CDN or image proxy for better performance.

3. **Cache invalidation is time-based only** - No webhook integration to invalidate when catalog changes in Square. TTL is 5 minutes, so changes take a bit to show up.

4. **No E2E tests** - Unit and integration tests are there, but no Cypress/Playwright for full user flows.

5. **Location stored client-side only** - If you wanted user accounts, you'd move this to a session or database.

### Assumptions

- Square sandbox has test data with locations, categories, and items
- Single currency per location (prices formatted as USD)
- Items without images show a placeholder
- "ACTIVE" status means the location is open

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # HTTP handlers
│   │   ├── services/       # Business logic + Square SDK
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Cache implementation
│   │   └── config/         # Square client setup
│   └── __tests__/          # Jest tests
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── stores/         # MobX stores
│   │   ├── services/       # API calls
│   │   └── hooks/          # Custom hooks
│   └── __tests__/          # Vitest tests
│
└── docker-compose.yml      # Container orchestration
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind 4, MobX |
| Backend | Node.js, Express 5, TypeScript, Square SDK |
| Caching | Redis / In-memory |
| Testing | Vitest (frontend), Jest (backend) |
| Deployment | Docker, nginx |

---

## Demo Video

