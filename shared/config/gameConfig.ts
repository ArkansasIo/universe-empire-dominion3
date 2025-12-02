// Game Configuration - Balance, economy, and rules
export const GAME_CONFIG = {
  // Resource production rates (per second base rate)
  resources: {
    metalPerSecond: 0.1,
    crystalPerSecond: 0.05,
    deuteriumPerSecond: 0.02,
    energyPerSecond: 0.15,
  },

  // Building costs and production
  buildings: {
    metalMine: { metal: 60, crystal: 15, deuterium: 5, time: 30 },
    crystalMine: { metal: 48, crystal: 24, deuterium: 10, time: 30 },
    deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 30, time: 30 },
    solarPlant: { metal: 75, crystal: 30, deuterium: 0, time: 30 },
    roboticsFactory: { metal: 400, crystal: 120, deuterium: 200, time: 120 },
    shipyard: { metal: 400, crystal: 200, deuterium: 100, time: 120 },
    researchLab: { metal: 200, crystal: 400, deuterium: 200, time: 120 },
  },

  // Unit/Ship costs
  units: {
    lightFighter: { metal: 3000, crystal: 1000, deuterium: 400, time: 10 },
    heavyFighter: { metal: 6000, crystal: 4000, deuterium: 1000, time: 30 },
    cruiser: { metal: 20000, crystal: 7000, deuterium: 2000, time: 60 },
    battleship: { metal: 45000, crystal: 15000, deuterium: 4000, time: 120 },
    smallCargo: { metal: 2000, crystal: 2000, deuterium: 500, time: 15 },
    largeCargo: { metal: 6000, crystal: 6000, deuterium: 1000, time: 30 },
    colonyShip: { metal: 10000, crystal: 20000, deuterium: 1000, time: 45 },
  },

  // Technology costs and progression
  technology: {
    baseMetalCost: 200,
    baseCrystalCost: 100,
    baseDeuteriumCost: 50,
    costMultiplier: 1.75,
    researchTime: 3600, // seconds
  },

  // Combat mechanics
  combat: {
    shieldRegeneration: 0.1, // per turn
    evasionBase: 5, // base evasion %
    accuracyBase: 90, // base accuracy %
    damageVariance: 0.15, // ±15%
    maxCombatTurns: 20,
  },

  // Kardashev scale progression (18 levels)
  kardashev: {
    levels: 18,
    requirements: {
      metal: 1000000,
      crystal: 500000,
      deuterium: 250000,
      research: 100,
    },
  },

  // Empire difficulty levels
  empireDifficulty: {
    levels: [
      { id: 0, name: "Peaceful", multiplier: 0.5, resources: 1.5, research: 0.8, combat: 0.3 },
      { id: 1, name: "Easy", multiplier: 0.75, resources: 1.3, research: 0.9, combat: 0.5 },
      { id: 2, name: "Normal", multiplier: 1.0, resources: 1.0, research: 1.0, combat: 1.0 },
      { id: 3, name: "Hard", multiplier: 1.5, resources: 0.8, research: 1.1, combat: 1.5 },
      { id: 4, name: "Extreme", multiplier: 2.0, resources: 0.6, research: 1.3, combat: 2.0 },
      { id: 5, name: "Impossible", multiplier: 3.0, resources: 0.4, research: 1.5, combat: 3.0 },
    ],
    kardashevMultiplier: {
      level1to3: 1.0,
      level4to6: 1.5,
      level7to9: 2.0,
      level10to12: 2.5,
      level13to15: 3.0,
      level16to18: 4.0,
    },
  },

  // Economy / Market
  market: {
    minPrice: 0.001,
    maxPrice: 1000,
    transactionFee: 0.02, // 2% fee
    orderExpirationTime: 86400000, // 24 hours in ms
  },

  // Alliance settings
  alliance: {
    minMembers: 1,
    maxMembers: 50,
    creationCost: { metal: 100000, crystal: 50000, deuterium: 10000 },
    dipomaticLevelRequirement: 5,
  },

  // Mission/Fleet mechanics
  missions: {
    fleetSpeed: 1, // multiplier for base speed
    minMissionTime: 60000, // 1 minute in ms
    maxActiveMissions: 100,
  },

  // Colonies mechanics
  colonies: {
    maxColoniesPerPlayer: 1000, // Maximum colonies across entire galaxy per player
  },

  // Game speed settings
  gameSpeed: {
    economySpeed: 1,
    fleetSpeed: 1,
    researchSpeed: 1,
    buildingSpeed: 1,
  },

  // Session and gameplay
  gameplay: {
    sessionTimeout: 604800000, // 7 days in ms
    inactivityThreshold: 2592000000, // 30 days in ms
    maxPlayers: 10000,
    newPlayerStartingResources: {
      metal: 1000,
      crystal: 500,
      deuterium: 0,
      energy: 0,
    },
  },

  // Turn system - Players gain turns over time
  turns: {
    turnsPerMinute: 6,           // 6 turns gained per minute (1 every 10 seconds)
    maxCurrentTurns: 1000,       // Maximum turns that can be stored
    startingTurns: 50,           // New players start with 50 turns
    offlineAccrual: true,        // Turns accumulate while offline
    maxOfflineAccrualHours: 24,  // Maximum hours of offline turn accrual
  },
};

// Tier-based resource multipliers for different government types
export const GOVERNMENT_MULTIPLIERS = {
  democracy: { efficiency: 1.2, corruption: 0.5, stability: 1.0 },
  corporate: { efficiency: 1.4, corruption: 1.2, stability: 0.8 },
  military: { efficiency: 1.0, corruption: 0.8, stability: 0.9 },
  theocracy: { efficiency: 0.9, corruption: 0.6, stability: 1.1 },
  monarchy: { efficiency: 1.1, corruption: 1.0, stability: 1.0 },
};

// Race-specific bonuses
export const RACE_BONUSES = {
  terran: { production: 1.0, combat: 1.0, research: 1.0 },
  humanoid: { production: 0.95, combat: 1.05, research: 1.0 },
  silicon: { production: 1.1, combat: 0.9, research: 1.05 },
  energy: { production: 0.9, combat: 1.1, research: 1.0 },
  hybrid: { production: 1.0, combat: 1.0, research: 1.05 },
};

// Story Mode - 12 Acts with Characters and Lore
export const STORY_MODE = {
  acts: [
    {
      id: 1,
      title: "Genesis",
      prolog: "Your empire awakens in the void of space. Commander, you must establish your first colony.",
      chapters: [
        { id: 1, name: "First Light", description: "Build your initial settlement", difficulty: 1, xp: 100 },
        { id: 2, name: "First Resources", description: "Mine metal and crystal", difficulty: 1, xp: 150 },
        { id: 3, name: "First Fleet", description: "Construct your first ships", difficulty: 2, xp: 200 },
      ],
      npc: { name: "Admiral Vex", role: "Guide", trait: "Wise strategist" },
      rewards: { metal: 5000, crystal: 2500, xp: 500, badge: "Genesis" },
    },
    {
      id: 2,
      title: "Expansion",
      prolog: "Territory awaits. Expand your reach across the stars.",
      chapters: [
        { id: 1, name: "Second Colony", description: "Colonize a new world", difficulty: 2, xp: 250 },
        { id: 2, name: "Trade Routes", description: "Establish market connections", difficulty: 2, xp: 300 },
        { id: 3, name: "Diplomatic Mission", description: "Make first contact", difficulty: 3, xp: 400 },
      ],
      npc: { name: "Merchant Kess", role: "Trader", trait: "Shrewd negotiator" },
      rewards: { metal: 10000, crystal: 5000, deuterium: 1000, xp: 1000, badge: "Expansionist" },
    },
    {
      id: 3,
      title: "First Contact",
      prolog: "You are not alone. Discover who shares the galaxy.",
      chapters: [
        { id: 1, name: "Scout Mission", description: "Explore unknown systems", difficulty: 3, xp: 300 },
        { id: 2, name: "Ancient Signals", description: "Decipher alien transmissions", difficulty: 3, xp: 350 },
        { id: 3, name: "Treaty Negotiation", description: "Forge your first alliance", difficulty: 4, xp: 500 },
      ],
      npc: { name: "Linguist Zor", role: "Scholar", trait: "Knowledgeable diplomat" },
      rewards: { metal: 15000, crystal: 8000, deuterium: 3000, xp: 1500, badge: "First Contact" },
    },
    {
      id: 4,
      title: "Conflict Rises",
      prolog: "Not all seek peace. War clouds gather on the horizon.",
      chapters: [
        { id: 1, name: "Border Skirmish", description: "Defend your colony from pirates", difficulty: 4, xp: 400 },
        { id: 2, name: "Arms Race", description: "Upgrade military defenses", difficulty: 4, xp: 450 },
        { id: 3, name: "First Blood", description: "Engage in space combat", difficulty: 5, xp: 600 },
      ],
      npc: { name: "General Thorn", role: "Military Commander", trait: "Strategic warrior" },
      rewards: { metal: 20000, crystal: 10000, deuterium: 5000, xp: 2000, badge: "War Hero" },
    },
    {
      id: 5,
      title: "Ancient Awakening",
      prolog: "Deep within space, something ancient stirs. Your discovery will change everything.",
      chapters: [
        { id: 1, name: "Ruins Discovery", description: "Explore ancient megastructure", difficulty: 5, xp: 500 },
        { id: 2, name: "Decipher Tech", description: "Unlock ancient technology", difficulty: 5, xp: 550 },
        { id: 3, name: "Unleash Power", description: "Activate the ancient device", difficulty: 6, xp: 700 },
      ],
      npc: { name: "Archaeologist Mira", role: "Historian", trait: "Brilliant researcher" },
      rewards: { metal: 25000, crystal: 15000, deuterium: 8000, xp: 2500, badge: "Archaeologist" },
    },
    {
      id: 6,
      title: "Galactic Politics",
      prolog: "The galaxy's fate hangs in balance. Political alliances will determine power.",
      chapters: [
        { id: 1, name: "Council Meeting", description: "Attend galactic council", difficulty: 4, xp: 400 },
        { id: 2, name: "Espionage Mission", description: "Gather intelligence on rivals", difficulty: 5, xp: 500 },
        { id: 3, name: "Grand Alliance", description: "Unite against common threat", difficulty: 6, xp: 700 },
      ],
      npc: { name: "Ambassador Lyx", role: "Diplomat", trait: "Cunning strategist" },
      rewards: { metal: 30000, crystal: 20000, deuterium: 10000, xp: 3000, badge: "Diplomat" },
    },
    {
      id: 7,
      title: "Dark Forces",
      prolog: "An evil rises from the depths. Ancient darkness threatens all life.",
      chapters: [
        { id: 1, name: "Plague Spreads", description: "Investigate mysterious epidemic", difficulty: 6, xp: 600 },
        { id: 2, name: "Source Revealed", description: "Discover the enemy's origin", difficulty: 6, xp: 650 },
        { id: 3, name: "Final Stand", description: "Battle the dark entity", difficulty: 7, xp: 900 },
      ],
      npc: { name: "Mystic Shadowblade", role: "Dark Knight", trait: "Tormented soul seeking redemption" },
      rewards: { metal: 40000, crystal: 25000, deuterium: 15000, xp: 4000, badge: "Savior" },
    },
    {
      id: 8,
      title: "Dimensional Rift",
      prolog: "Reality itself begins to fracture. You must seal the rift between worlds.",
      chapters: [
        { id: 1, name: "Anomaly Detection", description: "Detect dimensional instability", difficulty: 6, xp: 600 },
        { id: 2, name: "Research Rift", description: "Study the dimensional tear", difficulty: 7, xp: 700 },
        { id: 3, name: "Close the Portal", description: "Seal the rift permanently", difficulty: 8, xp: 1000 },
      ],
      npc: { name: "Physicist Dr. Kern", role: "Scientist", trait: "Brilliant but obsessed" },
      rewards: { metal: 50000, crystal: 30000, deuterium: 20000, xp: 5000, badge: "Dimensional Master" },
    },
    {
      id: 9,
      title: "Corporate Conspiracy",
      prolog: "Mega-corporations manipulate the galaxy from shadows. Expose their conspiracy.",
      chapters: [
        { id: 1, name: "Corporate Espionage", description: "Infiltrate corporate servers", difficulty: 7, xp: 700 },
        { id: 2, name: "Evidence Gathering", description: "Collect proof of corruption", difficulty: 7, xp: 750 },
        { id: 3, name: "Expose Truth", description: "Broadcast the conspiracy", difficulty: 7, xp: 800 },
      ],
      npc: { name: "CEO Valens", role: "Corrupt Businessman", trait: "Ruthless and cunning" },
      rewards: { metal: 60000, crystal: 35000, deuterium: 25000, xp: 6000, badge: "Whistleblower" },
    },
    {
      id: 10,
      title: "The Kardashev Challenge",
      prolog: "Ascend to god-like power. Construct a megastructure and harness star energy.",
      chapters: [
        { id: 1, name: "Blueprint Creation", description: "Design the Dyson Sphere", difficulty: 8, xp: 900 },
        { id: 2, name: "Resource Gathering", description: "Collect materials across galaxy", difficulty: 8, xp: 950 },
        { id: 3, name: "Construction Begins", description: "Start building the sphere", difficulty: 8, xp: 1000 },
      ],
      npc: { name: "Architect Prime", role: "Master Engineer", trait: "Visionary builder" },
      rewards: { metal: 100000, crystal: 50000, deuterium: 50000, xp: 8000, badge: "Kardashev II" },
    },
    {
      id: 11,
      title: "The Ascendant Path",
      prolog: "Few reach this height. Transcend mortal limitations and reshape reality itself.",
      chapters: [
        { id: 1, name: "Ascension Research", description: "Study transcendence theory", difficulty: 9, xp: 1000 },
        { id: 2, name: "Cosmic Convergence", description: "Align with cosmic forces", difficulty: 9, xp: 1100 },
        { id: 3, name: "Become Divine", description: "Achieve godhood", difficulty: 10, xp: 1500 },
      ],
      npc: { name: "The Oracle", role: "Cosmic Entity", trait: "All-knowing and timeless" },
      rewards: { metal: 150000, crystal: 100000, deuterium: 100000, xp: 10000, badge: "Divine" },
    },
    {
      id: 12,
      title: "Eternity's End",
      prolog: "You stand at the end of time itself. The fate of all existence rests in your hands.",
      chapters: [
        { id: 1, name: "Reality Collapse", description: "Prevent universal entropy", difficulty: 10, xp: 1200 },
        { id: 2, name: "Recreate Cosmos", description: "Rebuild the universe", difficulty: 10, xp: 1300 },
        { id: 3, name: "Eternal Reign", description: "Rule over all existence", difficulty: 10, xp: 2000 },
      ],
      npc: { name: "The Architect", role: "Creator", trait: "The ultimate being" },
      rewards: { metal: 200000, crystal: 150000, deuterium: 150000, xp: 15000, badge: "Eternal Ruler" },
    },
  ],
  
  elements: {
    fire: { damageBoost: 1.3, defenseReduction: 0.8, weakTo: "water" },
    water: { damageBoost: 1.2, defenseBoost: 1.1, weakTo: "lightning" },
    lightning: { damageBoost: 1.4, speedBoost: 1.25, weakTo: "earth" },
    earth: { damageBoost: 1.0, defenseBoost: 1.3, weakTo: "fire" },
    ice: { speedReduction: 0.7, damageBoost: 1.15, weakTo: "fire" },
    shadow: { stealth: 1.5, damageBoost: 1.25, weakTo: "light" },
    light: { defenseBoost: 1.4, healingBoost: 1.5, weakTo: "shadow" },
  },
};
