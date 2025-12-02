// Universe Structure - Galaxies, Quadrants, Sectors, Systems, Planets, Colonies
export const UNIVERSE_STRUCTURE_CONFIG = {
  // Galaxy Configuration
  galaxyStructure: {
    totalGalaxies: 100,
    galaxyTypes: ["spiral", "elliptical", "irregular", "lenticular"],
    sizeVariations: {
      tiny: { minSystems: 100, maxSystems: 500 },
      small: { minSystems: 500, maxSystems: 2000 },
      medium: { minSystems: 2000, maxSystems: 10000 },
      large: { minSystems: 10000, maxSystems: 50000 },
      massive: { minSystems: 50000, maxSystems: 100000 },
    },
  },

  // Quadrant Configuration (4 per galaxy)
  quadrantStructure: {
    quadrantsPerGalaxy: 4,
    sectorsPerQuadrant: 10,
    designation: "quadrant", // N, S, E, W or numbered
  },

  // Sector Configuration
  sectorStructure: {
    systemsPerSector: 50,
    securityLevels: ["peaceful", "contested", "dangerous", "warzones"],
    resourceVariation: 0.3, // 30% variation in resources
  },

  // Star System Configuration
  starSystemStructure: {
    planetsPerSystem: { min: 1, max: 15 },
    starTypes: ["O", "B", "A", "F", "G", "K", "M"],
    asteroidBelts: { probability: 0.6, rarity: "variable" },
    nebulae: { probability: 0.3, types: ["emission", "reflection", "dark"] },
  },

  // Planet Classes and Types
  planetClasses: {
    terrestrial: { habitability: 0.8, resources: { metal: 500, crystal: 300, deuterium: 100 } },
    oceanWorld: { habitability: 0.9, resources: { metal: 200, crystal: 400, deuterium: 300 } },
    desertPlanet: { habitability: 0.5, resources: { metal: 800, crystal: 200, deuterium: 50 } },
    gasGiant: { habitability: 0.1, resources: { metal: 100, crystal: 100, deuterium: 500 } },
    iceWorld: { habitability: 0.3, resources: { metal: 300, crystal: 500, deuterium: 200 } },
    volcanicPlanet: { habitability: 0.2, resources: { metal: 1000, crystal: 100, deuterium: 0 } },
    barrenRock: { habitability: 0.0, resources: { metal: 600, crystal: 200, deuterium: 0 } },
    alienWorld: { habitability: 0.5, resources: { metal: 400, crystal: 300, deuterium: 200 } },
    deadWorld: { habitability: 0.0, resources: { metal: 300, crystal: 100, deuterium: 50 } },
    asteroidField: { habitability: 0.0, resources: { metal: 2000, crystal: 500, deuterium: 100 } },
  },

  // Continent Configuration
  continentStructure: {
    continentsPerPlanet: { min: 1, max: 8 },
    continentSizes: ["tiny", "small", "medium", "large", "huge"],
    continentTypes: ["mountain", "plains", "forest", "desert", "tundra", "volcanic", "marsh"],
  },

  // Country Configuration (within continents)
  countryStructure: {
    countriesPerContinent: { min: 1, max: 15 },
    countryTypes: ["nation", "province", "territory", "colony", "settlement"],
  },

  // Territory/Region Configuration
  territoryStructure: {
    territoriesPerCountry: { min: 1, max: 20 },
    territoryTypes: ["farmland", "mining_zone", "industrial", "research", "military"],
  },

  // Field/Plot Configuration (actual mineable locations)
  fieldStructure: {
    fieldsPerTerritory: { min: 5, max: 50 },
    fieldTypes: ["metal_deposit", "crystal_vein", "deuterium_well", "mixed_resource", "rare_earth"],
    fieldSizes: {
      tiny: { multiplier: 0.5 },
      small: { multiplier: 1.0 },
      medium: { multiplier: 2.0 },
      large: { multiplier: 5.0 },
      massive: { multiplier: 10.0 },
    },
    resourceYieldPerHour: {
      metal_deposit: { metal: 10, crystal: 0, deuterium: 0 },
      crystal_vein: { metal: 0, crystal: 8, deuterium: 0 },
      deuterium_well: { metal: 0, crystal: 0, deuterium: 5 },
      mixed_resource: { metal: 5, crystal: 4, deuterium: 3 },
      rare_earth: { metal: 3, crystal: 3, deuterium: 8 },
    },
  },

  // Colony Configuration
  colonyStructure: {
    maxColoniesPerPlanet: 10,
    colonyLevels: { min: 1, max: 100 },
    colonyTypes: ["mining", "research", "agricultural", "industrial", "military", "trading"],
    buildingTypes: ["residential", "storage", "factory", "laboratory", "barracks", "market"],
  },

  // Coordinate System
  coordinateSystem: {
    format: "[X:Y:Z]",
    maxXCoordinate: 1000,
    maxYCoordinate: 1000,
    maxZCoordinate: 1000,
    description: "Galaxy:Sector:System coordinates",
  },

  // Universe Generation (Procedural/Deterministic)
  generationRules: {
    seed: "stellar_dominion_universe",
    deterministicGeneration: true,
    regenerationAllowed: false,
    customRegions: true,
  },
};
