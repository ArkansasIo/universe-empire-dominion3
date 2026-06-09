export type LegacyResourceKey = 'ore' | 'organics' | 'goods' | 'energy';
export type LegacyRaceCode = keyof typeof LEGACY_PHP_GAME_CONFIG.races.playable;

export const LEGACY_PHP_GAME_CONFIG = {
  identity: {
    name: 'Universe Civilization: Empire At War',
    releaseVersion: '0.014',
    genre: 'turn-based space trading, empire building, exploration, and combat',
    tone: 'frontier sci-fi with ancient-gate infrastructure, xenobe threats, and faction warfare',
    coreLoops: ['trade', 'upgrade', 'explore', 'colonize', 'research', 'defend', 'conquer'],
  },

  schedule: {
    tickMinutes: 6,
    turnsPerTick: 3,
    turns: 2,
    ports: 1,
    planets: 2,
    igb: 2,
    ranking: 30,
    news: 15,
    degrade: 6,
    apocalypse: 15,
    governor: 1,
    empire: 10,
  },

  universe: {
    sectorMax: 1000,
    linkMax: 10,
    universeSize: 500,
    maxPlanetsPerSector: 7,
    doomsdayColonistThreshold: 190000000,
    seedSystemsEnabled: true,
    defaultSeedCatalogSize: 1000,
    planetBiomeTypes: ['terran', 'desert', 'ice', 'toxic', 'volcanic', 'oceanic', 'barren', 'crystalline', 'storm'],
    hazardTypes: ['radiation', 'plasma_storm', 'gravity_shear', 'biohazard', 'sentinel_activity', 'pirate_patrol'],
  },

  rules: {
    serverClosed: false,
    accountCreationClosed: false,
    fedMaxHull: 8,
    fedMaxScore: 1000000,
    maxRanks: 100,
    mineHullSize: 2,
    ewdMaxHullSize: 15,
    ratingCombatFactor: 0.8,
    allowFullScan: true,
    allowNavComp: true,
    allowIntergalacticBank: true,
    allowGenesisDestroy: true,
    sofaAttackAllowed: true,
    knownSpaceMapAllowed: true,
    maxTraderoutesPerPlayer: 40,
    minBasesToOwnSector: 4,
    maxCreditsWithoutBase: 10000000,
  },

  newbieRegen: {
    enabled: true,
    hull: 8,
    engines: 8,
    power: 8,
    computer: 8,
    sensors: 8,
    armor: 8,
    shields: 8,
    beams: 8,
    torpLaunchers: 8,
    cloak: 8,
  },

  economy: {
    resources: {
      ore: { basePrice: 11, delta: 5, portRate: 75000, planetRate: 0.25, limit: 500000000 },
      organics: { basePrice: 5, delta: 2, portRate: 5000, planetRate: 0.5, limit: 500000000 },
      goods: { basePrice: 15, delta: 7, portRate: 75000, planetRate: 0.25, limit: 500000000 },
      energy: { basePrice: 3, delta: 1, portRate: 75000, planetRate: 0.5, limit: 5000000000 },
    },
    defaultPlanetProductionPercent: {
      ore: 20,
      organics: 20,
      goods: 20,
      energy: 20,
      fighters: 10,
      torpedoes: 10,
    },
    banking: {
      enabled: true,
      interest: 0.00015,
      paymentFee: 0.05,
      loanInterest: 0.001,
      loanFactor: 0.1,
      loanLimit: 0.25,
      shipTransferMinTurns: 0,
      shipTransferSenderValueLimit: 0.15,
      shipTransferCooldownMinutes: 1440,
      loanRepaymentMinutes: 1440,
      consolidateTurnCost: 10,
      maxCreditsAllowed: 10000000000000000,
      planetMaxCredits: 10000000000000000,
      interestRateMultiplier: 1.0003,
    },
    inventoryFactor: 1,
    upgradeCost: 1000,
    upgradeFactor: 2,
    levelFactor: 1.5,
  },

  devices: {
    genesisPrice: 100000000,
    beaconPrice: 100,
    emergencyWarpPrice: 100000000,
    warpEditorPrice: 100000,
    mineDeflectorPrice: 10,
    escapePodPrice: 100000,
    fuelScoopPrice: 100000,
    lastSeenShipDevicePrice: 10000000000,
    fighterPrice: 50,
    torpedoPrice: 25,
    torpedoDamageRate: 10,
    armorPrice: 5,
    maxEmergencyWarp: 10,
    maxGenesis: 10,
    maxBeacons: 10,
    maxWarpEditors: 10,
    maxUpgradeDevices: 45,
  },

  production: {
    fighterPlanetRate: 0.01,
    torpedoPlanetRate: 0.025,
    creditsPlanetRate: 3,
    colonistPrice: 5,
    colonistProductionRate: 0.005,
    colonistReproductionRate: 0.0005,
    colonistLimit: 200000000,
    organicsConsumption: 0.05,
    starvationDeathRate: 0.01,
    baseDefense: 1,
    baseRequirements: { ore: 10000, goods: 10000, organics: 10000, credits: 10000000 },
    portRegenRate: 10,
    defenseDegradeRate: 0.05,
    energyPerFighter: 0.1,
    spacePlagueKills: 0.2,
  },

  playerStart: {
    credits: 1000,
    turns: 1200,
    fighters: 10,
    armor: 10,
    energy: 100,
    genesisDevices: 1,
    lastSeenShipDevice: false,
    warpEditors: 0,
    mineDeflectors: 0,
    emergencyWarp: 0,
    beacons: 0,
    escapePod: false,
    fuelScoop: false,
    maxTurns: 2500,
  },

  facilities: {
    productionPerTick: {
      hydroponicsFood: 1,
      shipyardParts: 1,
      solarPlantEnergy: 1,
      researchPoints: 1,
      miningOre: 1,
    },
    requirements: {
      hydroponics: { credits: 1000000000, organics: 500000000, goods: 100000000 },
      banking: { credits: 10000000000 },
      shipyard: { credits: 10000000000, goods: 500000000, ore: 500000000 },
      solar: { credits: 500000000, goods: 100000000, ore: 100000000 },
      medical: { credits: 5000000000, goods: 500000000, colonists: 40000000 },
      research: { credits: 5000000000, colonists: 66666667 },
      military: { credits: 5000000000, colonists: 66666667, torpedoes: 75000000, fighters: 75000000 },
    },
  },

  bounty: {
    maxValue: 0.15,
    ratio: 0.75,
    minTurns: 500,
    blockAllSpecialPorts: true,
  },

  races: {
    enabled: true,
    playableCount: 9,
    nonPlayableCount: 32,
    defaultRaceCode: 'terran_union',
    statScale: { min: 1, max: 10 },
    statGroups: {
      biology: ['vitality', 'adaptation', 'reproduction', 'toxicity_resistance'],
      society: ['diplomacy', 'discipline', 'espionage', 'trade_affinity'],
      warfare: ['piloting', 'boarding', 'ground_combat', 'fleet_coordination'],
      science: ['research_speed', 'engineering', 'xenoarchaeology', 'gate_theory'],
    },
    playable: {
      terran_union: { name: 'Terran Union', class: 'adaptive', subclass: 'industrial diplomat', type: 'human', favoredSystems: ['trade', 'research', 'colonies'] },
      elyrian_concord: { name: 'Elyrian Concord', class: 'psionic', subclass: 'empathic navigator', type: 'near-human', favoredSystems: ['diplomacy', 'sensors', 'stargates'] },
      kharax_brood: { name: 'Kharax Brood', class: 'hive', subclass: 'organic swarm', type: 'insectoid', favoredSystems: ['fighters', 'colonies', 'boarding'] },
      orrakai_dynasty: { name: 'Orrakai Dynasty', class: 'martial', subclass: 'honor fleet', type: 'reptilian', favoredSystems: ['armor', 'torpedoes', 'planet_defense'] },
      vespari_syndicate: { name: 'Vespari Syndicate', class: 'mercantile', subclass: 'free-port cartel', type: 'avian', favoredSystems: ['trade', 'banking', 'smuggling'] },
      myridian_collective: { name: 'Myridian Collective', class: 'synthetic', subclass: 'machine polity', type: 'ai', favoredSystems: ['research', 'automation', 'shipyards'] },
      thalassan_current: { name: 'Thalassan Current', class: 'aquatic', subclass: 'bioengineer', type: 'amphibian', favoredSystems: ['organics', 'medical', 'terraforming'] },
      noktari_veil: { name: 'Noktari Veil', class: 'stealth', subclass: 'shadow scout', type: 'nocturnal', favoredSystems: ['cloak', 'espionage', 'ambush'] },
      sauren_ascendancy: { name: 'Sauren Ascendancy', class: 'ancient', subclass: 'gate heir', type: 'precursor-descended', favoredSystems: ['stargates', 'artifacts', 'capital_ships'] },
    },
    nonPlayableArchetypes: [
      'xenobe_warlord', 'void_nomad', 'sentinel_drone', 'pirate_clan', 'merchant_house', 'ancient_guardian', 'bio_plague_cult', 'rogue_ai',
      'crystal_mind', 'nebula_hunter', 'gatekeeper_order', 'terraformer_remnant', 'clone_baron', 'asteroid_tribe', 'dark_fleet', 'relic_priest',
      'quantum_shade', 'orbital_scavenger', 'plasma_raider', 'peacekeeper_cell', 'wormhole_oracle', 'deep_core_miner', 'radiant_swarm', 'ice_monk',
      'gene_vault', 'chronicle_archive', 'solar_knight', 'dust_reaver', 'hydro_cartel', 'storm_binder', 'forge_clan', 'silicate_hive',
    ],
  },

  xenobe: {
    max: 10,
    startCredits: 1000000,
    unemploymentCreditsPerTick: 100000,
    aggressionPercent: 100,
    planetOwnershipPercent: 5,
    maxStartSize: 15,
  },

  travelSystems: {
    warpLinks: { turnCost: 1, risk: 'low', description: 'Standard sector-to-sector movement through mapped links.' },
    realspace: { turnCost: 'distance and engine based', risk: 'medium', description: 'Direct movement through open space.' },
    stargates: { fuel: 'energy', cooldownTurns: 3, requiredResearch: 'gate_harmonics', description: 'Stable public routes between major systems.' },
    jumpgates: { fuel: 'energy and parts', cooldownTurns: 8, requiredResearch: 'jump_field_geometry', description: 'Strategic gates for long-range empire logistics.' },
  },

  shipClasses: {
    scout: { role: 'mapping and evasion', subclasses: ['pathfinder', 'specter', 'courier'] },
    freighter: { role: 'trade and hauling', subclasses: ['bulk hauler', 'armored convoy', 'smuggler hold'] },
    frigate: { role: 'balanced combat patrol', subclasses: ['missile frigate', 'escort', 'interdictor'] },
    cruiser: { role: 'front-line fleet combat', subclasses: ['beam cruiser', 'carrier cruiser', 'siege cruiser'] },
    dreadnought: { role: 'late-game capital warfare', subclasses: ['planet breaker', 'gate bastion', 'command ark'] },
    motherShip: { role: 'mobile empire hub', subclasses: ['ark mother', 'forge mother', 'hive mother'] },
  },

  technologyTree: {
    economy: ['port analytics', 'cargo compression', 'trade AI', 'quantum banking'],
    warfare: ['beam focusing', 'torpedo telemetry', 'armor lamination', 'fighter doctrine'],
    defense: ['shield harmonics', 'mine deflection', 'base bastions', 'planetary grid'],
    exploration: ['deep sensors', 'hazard mapping', 'seed cartography', 'artifact decoding'],
    gates: ['gate harmonics', 'jump field geometry', 'stargate stabilization', 'precursor routing'],
    colonies: ['hydroponics', 'medical hubs', 'terraforming', 'colonist logistics'],
  },

  researchRules: {
    basePointsPerTick: 1,
    softCapPerProject: 1000000,
    failureModes: ['prototype_loss', 'resource_overrun', 'gate_instability', 'data_corruption'],
    successRewards: ['stat_bonus', 'new_device', 'new_route', 'production_bonus', 'defense_bonus'],
  },
} as const;

export function getLegacyTurnsPerMinute(): number {
  const { turnsPerTick, tickMinutes } = LEGACY_PHP_GAME_CONFIG.schedule;
  return turnsPerTick / tickMinutes;
}

export function getLegacyTurnIntervalMs(): number {
  return Math.round(60000 / getLegacyTurnsPerMinute());
}

export function getLegacyMaxOfflineTurns(hours = 24): number {
  return Math.floor(getLegacyTurnsPerMinute() * 60 * hours);
}

export function createLegacyStartingResources() {
  const start = LEGACY_PHP_GAME_CONFIG.playerStart;
  return {
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: start.energy,
    credits: start.credits,
    food: 0,
    water: 0,
    ore: 0,
    organics: 0,
    goods: 0,
  };
}

export function createLegacyStartingTurnsData(now = Date.now()) {
  const start = LEGACY_PHP_GAME_CONFIG.playerStart;
  return {
    totalTurnsGenerated: start.turns,
    currentTurn: 0,
    lastTurnTimestamp: now,
    turnsAvailable: start.turns,
    currentResearchTurns: 0,
    researchTurnHistory: [],
  };
}

export function createLegacyStartingInventory() {
  const start = LEGACY_PHP_GAME_CONFIG.playerStart;
  return {
    fighters: start.fighters,
    armor: start.armor,
    genesisDevices: start.genesisDevices,
    lastSeenShipDevice: start.lastSeenShipDevice,
    warpEditors: start.warpEditors,
    mineDeflectors: start.mineDeflectors,
    emergencyWarp: start.emergencyWarp,
    beacons: start.beacons,
    escapePod: start.escapePod,
    fuelScoop: start.fuelScoop,
  };
}

export function calculateLegacyMarketPrice(resource: LegacyResourceKey, direction: 'min' | 'base' | 'max' = 'base'): number {
  const config = LEGACY_PHP_GAME_CONFIG.economy.resources[resource];
  if (direction === 'min') return Math.max(0, config.basePrice - config.delta);
  if (direction === 'max') return config.basePrice + config.delta;
  return config.basePrice;
}

export function calculateLegacyPortProduction(resource: LegacyResourceKey, ticks = 1): number {
  const config = LEGACY_PHP_GAME_CONFIG.economy.resources[resource];
  const produced = config.portRate * LEGACY_PHP_GAME_CONFIG.production.portRegenRate * Math.max(0, ticks);
  return Math.min(config.limit, Math.floor(produced));
}

export function calculateLegacyPlanetProduction(resource: LegacyResourceKey, productionPercent: number, ticks = 1): number {
  const config = LEGACY_PHP_GAME_CONFIG.economy.resources[resource];
  const safePercent = Math.max(0, productionPercent) / 100;
  return Math.min(config.limit, Math.floor(config.planetRate * safePercent * LEGACY_PHP_GAME_CONFIG.production.colonistLimit * Math.max(0, ticks)));
}

export function getLegacyRace(code: string = LEGACY_PHP_GAME_CONFIG.races.defaultRaceCode) {
  const races = LEGACY_PHP_GAME_CONFIG.races.playable;
  return races[code as LegacyRaceCode] ?? races[LEGACY_PHP_GAME_CONFIG.races.defaultRaceCode];
}

export function getLegacyRaceSystemBonus(code: string) {
  const race = getLegacyRace(code);
  const favored = new Set(race.favoredSystems);
  return {
    production: favored.has('colonies') || favored.has('organics') ? 1.1 : 1,
    combat: favored.has('armor') || favored.has('torpedoes') || favored.has('fighters') ? 1.1 : 1,
    research: favored.has('research') || favored.has('artifacts') ? 1.1 : 1,
    trade: favored.has('trade') || favored.has('banking') ? 1.1 : 1,
    stealth: favored.has('cloak') || favored.has('espionage') ? 1.1 : 1,
    gates: favored.has('stargates') ? 1.1 : 1,
  };
}

export function getLegacyPublicGameConfig() {
  return {
    identity: LEGACY_PHP_GAME_CONFIG.identity,
    schedule: LEGACY_PHP_GAME_CONFIG.schedule,
    universe: LEGACY_PHP_GAME_CONFIG.universe,
    rules: LEGACY_PHP_GAME_CONFIG.rules,
    economy: LEGACY_PHP_GAME_CONFIG.economy,
    playerStart: LEGACY_PHP_GAME_CONFIG.playerStart,
    facilities: LEGACY_PHP_GAME_CONFIG.facilities,
    races: LEGACY_PHP_GAME_CONFIG.races,
    travelSystems: LEGACY_PHP_GAME_CONFIG.travelSystems,
    shipClasses: LEGACY_PHP_GAME_CONFIG.shipClasses,
    technologyTree: LEGACY_PHP_GAME_CONFIG.technologyTree,
    researchRules: LEGACY_PHP_GAME_CONFIG.researchRules,
    derived: {
      turnsPerMinute: getLegacyTurnsPerMinute(),
      turnIntervalMs: getLegacyTurnIntervalMs(),
      maxOfflineTurns24h: getLegacyMaxOfflineTurns(24),
      startingResources: createLegacyStartingResources(),
      startingTurnsData: createLegacyStartingTurnsData(0),
      startingInventory: createLegacyStartingInventory(),
    },
  };
}
