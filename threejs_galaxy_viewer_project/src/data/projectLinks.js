export const PROJECT_SOURCE_LINKS = [
  {
    id: "client",
    label: "Client UI",
    path: "client/",
    description: "Main game frontend pages, UI shells, and browser-facing application code.",
    category: "app",
  },
  {
    id: "server",
    label: "Server",
    path: "server/",
    description: "Backend route handlers, auth logic, and game service endpoints.",
    category: "app",
  },
  {
    id: "shared",
    label: "Shared",
    path: "shared/",
    description: "Shared types, models, and cross-layer game logic used by client and server.",
    category: "core",
  },
  {
    id: "src",
    label: "Root Source",
    path: "src/",
    description: "Primary source tree for shared runtime code and game systems.",
    category: "core",
  },
  {
    id: "backend",
    label: "Backend",
    path: "backend/",
    description: "Additional backend services and supporting server-side modules.",
    category: "app",
  },
  {
    id: "frontend",
    label: "Frontend",
    path: "frontend/",
    description: "Supporting frontend modules and alternate client-side source layout.",
    category: "app",
  },
  {
    id: "game-source-app",
    label: "Game Source App",
    path: "game-source/app/",
    description: "Game-source application layer tied to deployment and content workflows.",
    category: "game-source",
  },
  {
    id: "game-source-public",
    label: "Game Source Public",
    path: "game-source/public/",
    description: "Browser-delivered runtime files, including exported 3D assets.",
    category: "game-source",
  },
  {
    id: "game-source-resources",
    label: "Game Source Resources",
    path: "game-source/resources/",
    description: "Source resources and authoring-time 3D content for the main game.",
    category: "game-source",
  },
];

export const VIEWER_ASSET_MOUNTS = [
  {
    label: "Viewer Runtime Assets",
    path: "threejs_galaxy_viewer_project/assets/",
    purpose: "Standalone browser viewer textures, models, and placeholder templates.",
  },
  {
    label: "Main Game Public 3D",
    path: "game-source/public/assets/3d/",
    purpose: "Web-runtime 3D exports that the main game can deliver to players.",
  },
  {
    label: "Main Game Source 3D",
    path: "game-source/resources/3d/",
    purpose: "Higher-fidelity source assets before conversion into runtime packages.",
  },
];
