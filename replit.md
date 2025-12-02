# Overview

Stellar Dominion is a 4X space strategy MMORPG browser game featuring real-time resource management, fleet combat, and RPG progression elements. Players build planetary empires, research technologies, construct fleets, and engage in strategic combat across a persistent galaxy. The game combines classic real-time strategy mechanics with modern web technologies and deep customization systems.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18+ with TypeScript, bundled via Vite
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme system supporting light/dark modes
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: React Context API via `GameContext` for global game state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Fonts**: Custom web fonts (Orbitron, Rajdhani, Inter) for sci-fi aesthetic

**Design Pattern**: The application uses a component-based architecture with a central game context provider wrapping all game-related pages. The context manages resources, buildings, fleets, missions, and real-time game ticks via a client-side game loop.

**Key Design Decision**: A simulated game loop runs every second using `useEffect` to calculate resource production, process construction/research queues, and update fleet positions. This provides real-time feedback without constant server polling.

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js
- **Database**: Drizzle ORM with Neon PostgreSQL (serverless)
- **Authentication**: Username/password authentication with SHA-256 hashing
- **Session Management**: Express-session with PostgreSQL session store (connect-pg-simple)
- **Build System**: ESBuild for server bundling, Vite for client bundling

**API Pattern**: RESTful API endpoints under `/api` namespace
- `/api/auth/*` - Authentication endpoints (login, register, logout)
- `/api/game/*` - Game state CRUD operations
- `/api/missions/*` - Fleet mission management
- `/api/messages/*` - Player messaging system
- `/api/alliances/*` - Alliance operations
- `/api/market/*` - Trading system

**Session Strategy**: Server-side sessions stored in PostgreSQL with HTTP-only cookies. Sessions expire after 7 days. Authentication state is checked via `/api/auth/user` endpoint.

**Design Decision**: Single-page application (SPA) architecture where the Express server primarily serves as an API and static file server. The Vite dev server proxies API requests during development.

## Data Storage Solutions

**Primary Database**: PostgreSQL via Neon serverless
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **ORM**: Drizzle with Zod schema validation
- **Migration Strategy**: Drizzle-kit for schema migrations to `./migrations`

**Schema Design**:
- `sessions` - Server-side session storage
- `users` - User authentication data (id, email, profile info)
- `player_states` - Complete game state per player (JSONB for resources, buildings, research, units, etc.)
- `missions` - Active fleet movements
- `messages` - Player-to-player communication
- `alliances` - Guild/faction data
- `alliance_members` - Alliance membership records
- `market_orders` - Trading system orders
- `queue_items` - Construction/research queues

**Design Decision**: Heavily denormalized schema using JSONB columns for game state. This allows flexible data structures and reduces join complexity for frequently accessed data. Player state is stored as a single record with nested objects rather than normalized tables.

**Rationale**: Game state queries are read-heavy with frequent updates to multiple related fields (resources, buildings, units). JSONB allows atomic updates of the entire state object and simplifies the API layer.

## Configuration System

**Game Configuration** (`shared/config/gameConfig.ts`):
- Resource production rates and building costs
- Unit/ship costs and combat stats
- Technology progression system
- Combat mechanics (damage calculation, evasion, etc.)
- Kardashev scale progression requirements
- Market economy settings
- Alliance settings
- Government type multipliers
- Race-specific bonuses

**System Configuration** (`shared/config/systemConfig.ts`):
- Server settings (port, environment, timeouts)
- Database configuration and connection pooling
- Authentication settings (password requirements, session timeout)
- Logging configuration
- Caching and rate limiting
- Email provider settings
- Feature flags for gradual rollout
- Monitoring and analytics settings
- Backup and maintenance schedules
- Universe generation parameters
- Game loop tick intervals

## Database Schema Files

**SQL Schema Files** (in `sql/schema/`):
- `universe.sql` - Celestial objects (galaxies, stars, planets, moons, asteroids, anomalies)
- `game.sql` - Game balance (resources, tech tree, combat, achievements)
- `system.sql` - Server configuration (settings, admin logs, feature flags)

**SQL Seed Files** (in `sql/seeds/`):
- `universe-seed.sql` - Initial universe configuration and unit costs
- `game-seed.sql` - Technology tree, achievements, game settings

These files are referenced for documentation and can be manually executed, but schema is primarily managed through Drizzle ORM.

## Authentication and Authorization

**Provider**: Username/Password Authentication
- **Strategy**: Local authentication with SHA-256 password hashing
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Token Management**: Session cookies (HTTP-only, secure flag conditional)

**Flow**:
1. User enters username and password on login page
2. Password is hashed and compared against stored hash
3. On successful match, session ID is created and stored in database
4. Session cookie is set (secure flag disabled in dev, enabled in production)
5. Client includes cookie in subsequent requests
6. Session is refreshed on each request (resave: true)

**Session Configuration**: 
- `resave: true` - Sessions refresh on every request, keeping active sessions alive
- `saveUninitialized: true` - Sessions are stored immediately
- Cookie `secure` flag is conditional based on environment (false in dev HTTP, true in prod HTTPS)
- `sameSite: 'lax'` for CSRF protection

**Authorization Pattern**: Session-based with middleware checking `req.session.userId` existence. Protected routes use `isAuthenticated` middleware.

**First-Time Setup**: New users see empire setup screen to choose race, class, and government type before accessing the game.

**Design Decision**: Server-side sessions rather than JWT for simplicity and security. Sessions can be invalidated server-side and don't expose claims to the client.

## External Dependencies

**Third-Party Services**:
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Infrastructure**: Deployment platform with automatic HTTPS

**NPM Packages** (Key Dependencies):
- **@neondatabase/serverless**: PostgreSQL driver with WebSocket support
- **drizzle-orm**: Type-safe ORM
- **express**: Web server framework
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **zod**: Runtime type validation
- **@radix-ui/***: Headless UI primitives for accessibility
- **framer-motion**: Animation library
- **recharts**: Chart/graph library

**Vite Plugins**:
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development environment indicator
- `@replit/vite-plugin-runtime-error-modal`: Enhanced error display

**Design Decision**: Bundle allowlisted server dependencies to reduce cold start times by minimizing filesystem operations during module resolution.

**Build Process**: Two-stage build with Vite for client (outputs to `dist/public`) and ESBuild for server (outputs to `dist/index.cjs`). The server is bundled as a single CommonJS file for faster startup.

# Game Systems

## Combat Engine
Advanced multi-layer damage system with:
- Shield, armor, and hull damage layers
- Evasion mechanics (base 5-20% depending on ship)
- Accuracy calculations (90-100% base)
- Weapon effectiveness matrix against different armor types
- Target prioritization (highest threat first)
- Detailed battle logs and reporting

## Kardashev Scale
18-level empire progression system tracking:
- Metal, crystal, deuterium, and research accumulation
- Level-based empire bonuses
- Unlockable technologies and buildings at each level
- Requirements scale exponentially

## Turn-Based MMORPG Mechanics
- Tick-based game loop (1-second ticks)
- Queue processor for construction and research
- Mission lifecycle management
- Per-tick resource production calculations
- Deterministic universe seed system

## Universe Generation
Procedurally generated deterministic universe:
- 10 planet classes based on characteristics
- 7 asteroid types with composition
- 9 star types (O, B, A, F, G, K, M, N, H)
- Coordinate-based hashing ensures reproducibility
- Supports full galaxy exploration

## Technology System
7 rarity tiers (common to transcendent) with:
- 9 tech classes (weapons, defense, economy, exploration, etc.)
- Synergies between technologies
- 8+ sample technologies with complete stat definitions
- Tech progression trees

# Recent Changes

- Fixed login authentication: Session cookie secure flag is now conditional (false in dev HTTP, true in prod HTTPS)
- Added setupComplete field to validation schema to allow empire setup completion
- Created back buttons on Auth and AccountSetup pages for navigation
- Fixed session persistence: Changed resave and saveUninitialized to true to keep sessions active
- Created comprehensive game configuration system (shared/config/)
- Added SQL database schema files (universe.sql, game.sql, system.sql)
- Created seed data files with game balance and configuration

# File Structure

```
project/
├── client/
│   ├── src/
│   │   ├── pages/          # Game pages (Overview, Resources, etc.)
│   │   ├── lib/            # Game logic (context, combat, universe, etc.)
│   │   ├── components/     # Reusable UI components
│   │   └── index.html      # OpenGraph meta tags
│   └── vite.config.ts      # Vite configuration
├── server/
│   ├── index.ts            # Express server entry
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   └── basicAuth.ts        # Authentication middleware
├── shared/
│   ├── schema.ts           # Drizzle ORM schema
│   └── config/             # Game and system configuration
│       ├── gameConfig.ts   # Game balance settings
│       └── systemConfig.ts # Server settings
├── sql/
│   ├── schema/             # Database schema SQL files
│   ├── seeds/              # Seed data SQL files
│   └── README.md           # SQL documentation
├── migrations/             # Drizzle migrations
└── package.json
```
