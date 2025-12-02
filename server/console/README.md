# Backend Console Workflows

This folder contains the backend console management system for Stellar Dominion.

## What is the Backend Console?

The backend console is an interactive CLI tool for server administrators to:
- View real-time server status and statistics
- Browse and filter server logs by type and category
- Access server settings and configuration
- Clear logs and export diagnostic data
- Manage database connections
- View session information
- Access environment variables

## Running the Console

### Option 1: As a Standalone Workflow (Recommended)

Add to your `.replit` file:

```ini
[backend-console]
run = "tsx server/console/index.ts"
```

Then open a new workflow panel for "backend-console" to run it interactively.

### Option 2: Manual Run

```bash
npm run tsx server/console/index.ts
```

### Option 3: In Node

```bash
npm run dev -- server/console/index.ts
```

## Features

- **System Status**: View server health, database connection, active services
- **Log Management**: 
  - View all logs with timestamps and categories
  - Filter by error level (ERROR, WARN, INFO, DEBUG)
  - Filter by module (AUTH, API, DB, SESSION, etc.)
  - Clear all logs
  - Export logs to JSON
- **Server Settings**: Database info, session configuration, environment variables
- **Real-time Updates**: Live statistics on total logs, errors, warnings

## Log Categories

- **AUTH**: Authentication, login, logout, session events
- **API**: HTTP requests, response codes, performance metrics
- **DB**: Database queries, connection status
- **SESSION**: Session creation, destruction, expiration
- **SERVER**: General server events and startup

## Colors and Symbols

- 🟢 `●` - Active/Online/Success
- 🔴 `●` - Offline/Inactive/Error
- 🟡 `●` - Warning/Resetting
- ✅ - Success operations
- ❌ - Errors
- ⚠️ - Warnings
- ℹ️ - Information
- 🔍 - Debug

## Keyboard Navigation

- Type the menu number (1-5, 0) and press Enter
- Type `0` to go back or exit
- Press Enter to continue after viewing information

## Integration with Main Server

The console menu works alongside the main "Start application" workflow:
- Both can run simultaneously
- The console has read-only access to server logs
- Authentication is not required for console access
- Logs are shared in-memory between both workflows

## Architecture

```
server/console/
├── index.ts          # Workflow entry point
├── README.md         # This file
└── (consoleMenu.ts in parent - the actual menu implementation)
```

The actual console menu class is in `server/consoleMenu.ts` which is shared between the main server and console workflows.
