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
- **Authentication**: Replit Auth via OpenID Connect with Passport.js
- **Session Management**: Express-session with PostgreSQL session store (connect-pg-simple)
- **Build System**: ESBuild for server bundling, Vite for client bundling

**API Pattern**: RESTful API endpoints under `/api` namespace
- `/api/auth/*` - Authentication endpoints
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

## Authentication and Authorization

**Provider**: Replit Auth (OpenID Connect)
- **Strategy**: OAuth2/OIDC flow with automatic user provisioning
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Token Management**: Access and refresh tokens stored in session

**Flow**:
1. User clicks "Sign in with Replit"
2. Redirects to Replit OIDC provider
3. Callback receives authorization code
4. Exchange code for tokens
5. Create/update user record in database
6. Establish server-side session
7. Redirect to application

**Authorization Pattern**: Session-based with middleware checking `req.user` existence. Protected routes use `isAuthenticated` middleware.

**First-Time Setup**: New users are redirected to account setup flow to choose race, class, and government type before accessing the game.

**Design Decision**: Server-side sessions rather than JWT for simplicity and security. Sessions can be invalidated server-side and don't expose claims to the client.

## External Dependencies

**Third-Party Services**:
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Auth**: OAuth authentication provider
- **Replit Infrastructure**: Deployment platform with automatic HTTPS and domain provisioning

**NPM Packages** (Key Dependencies):
- **@neondatabase/serverless**: PostgreSQL driver with WebSocket support
- **drizzle-orm**: Type-safe ORM
- **express**: Web server framework
- **passport**: Authentication middleware
- **openid-client**: OIDC client library
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **zod**: Runtime type validation
- **@radix-ui/***: Headless UI primitives for accessibility

**Vite Plugins**:
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development environment indicator
- `@replit/vite-plugin-runtime-error-modal`: Enhanced error display
- Custom `metaImagesPlugin`: Updates OpenGraph meta tags for Replit deployment domains

**Design Decision**: Bundle allowlisted server dependencies (database drivers, heavy libraries) to reduce cold start times by minimizing filesystem operations during module resolution.

**Build Process**: Two-stage build with Vite for client (outputs to `dist/public`) and ESBuild for server (outputs to `dist/index.cjs`). The server is bundled as a single CommonJS file for faster startup.