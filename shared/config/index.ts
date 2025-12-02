// Central configuration export point
export { GAME_CONFIG, GOVERNMENT_MULTIPLIERS, RACE_BONUSES } from './gameConfig';
export { SYSTEM_CONFIG, getEnvConfig } from './systemConfig';

// Re-export for convenience
export * as GameConfig from './gameConfig';
export * as SystemConfig from './systemConfig';
