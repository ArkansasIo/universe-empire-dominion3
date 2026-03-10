import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Game Engine - Core game logic and mechanics
 * Handles resource production, building construction, research progress, etc.
 */

// Building production rates per level per hour
const PRODUCTION_RATES = {
  metalMine: 30,
  crystalMine: 20,
  deuteriumSynthesizer: 10,
  solarPlant: 20,
};

// Building energy consumption
const ENERGY_CONSUMPTION = {
  metalMine: 10,
  crystalMine: 10,
  deuteriumSynthesizer: 20,
  researchLab: 30,
  roboticsFactory: 40,
  shipyard: 50,
};

// Building costs (base values, scale with level)
export const BUILDING_COSTS = {
  metalMine: { metal: 60, crystal: 15, deuterium: 0, energy: 0 },
  crystalMine: { metal: 48, crystal: 24, deuterium: 0, energy: 0 },
  deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0, energy: 0 },
  solarPlant: { metal: 75, crystal: 30, deuterium: 0, energy: 0 },
  roboticsFactory: { metal: 400, crystal: 120, deuterium: 200, energy: 0 },
  researchLab: { metal: 200, crystal: 400, deuterium: 200, energy: 0 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100, energy: 0 },
};

// Build times in seconds (base values)
const BUILD_TIMES = {
  metalMine: 30,
  crystalMine: 40,
  deuteriumSynthesizer: 60,
  solarPlant: 25,
  roboticsFactory: 120,
  researchLab: 180,
  shipyard: 240,
};

/**
 * Calculate resource production for a player
 */
export function calculateProduction(buildings: any, research: any = {}) {
  const metalProduction = Math.floor(
    PRODUCTION_RATES.metalMine * (buildings.metalMine || 0) * 1.1 * (1 + (research.miningTechnology || 0) * 0.1)
  );
  
  const crystalProduction = Math.floor(
    PRODUCTION_RATES.crystalMine * (buildings.crystalMine || 0) * 1.05 * (1 + (research.miningTechnology || 0) * 0.1)
  );
  
  const deuteriumProduction = Math.floor(
    PRODUCTION_RATES.deuteriumSynthesizer * (buildings.deuteriumSynthesizer || 0) * 1.02 * (1 + (research.energyTechnology || 0) * 0.05)
  );
  
  const solarProduction = Math.floor(
    PRODUCTION_RATES.solarPlant * (buildings.solarPlant || 0) * (1 + (research.energyTechnology || 0) * 0.1)
  );
  
  // Calculate total energy consumption
  let energyConsumption = 0;
  Object.keys(ENERGY_CONSUMPTION).forEach(building => {
    if (buildings[building]) {
      energyConsumption += ENERGY_CONSUMPTION[building as keyof typeof ENERGY_CONSUMPTION] * buildings[building];
    }
  });
  
  const energyProduction = solarProduction - energyConsumption;
  
  return {
    metal: metalProduction,
    crystal: crystalProduction,
    deuterium: deuteriumProduction,
    energy: energyProduction,
  };
}

/**
 * Calculate building cost at a specific level
 */
export function calculateBuildingCost(buildingType: string, currentLevel: number) {
  const baseCost = BUILDING_COSTS[buildingType as keyof typeof BUILDING_COSTS];
  if (!baseCost) return null;
  
  // Cost increases exponentially with level (1.5x per level)
  const multiplier = Math.pow(1.5, currentLevel);
  
  return {
    metal: Math.floor(baseCost.metal * multiplier),
    crystal: Math.floor(baseCost.crystal * multiplier),
    deuterium: Math.floor(baseCost.deuterium * multiplier),
    energy: baseCost.energy,
  };
}

/**
 * Calculate building time (affected by robotics factory)
 */
export function calculateBuildTime(buildingType: string, currentLevel: number, roboticsLevel: number = 0) {
  const baseTime = BUILD_TIMES[buildingType as keyof typeof BUILD_TIMES] || 60;
  const levelMultiplier = Math.pow(1.3, currentLevel);
  const roboticsReduction = 1 / (1 + roboticsLevel * 0.1); // 10% faster per level
  
  return Math.floor(baseTime * levelMultiplier * roboticsReduction);
}

/**
 * Process resource production tick (called every minute or on demand)
 */
export async function processResourceTick(userId: string) {
  try {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });
    
    if (!playerState) {
      throw new Error("Player state not found");
    }
    
    const lastUpdate = playerState.lastResourceUpdate ? new Date(playerState.lastResourceUpdate).getTime() : Date.now();
    const now = Date.now();
    const timeDelta = (now - lastUpdate) / 1000 / 3600; // Convert to hours
    
    // Calculate production rates
    const production = calculateProduction(
      playerState.buildings as any,
      playerState.research as any
    );
    
    // Calculate new resource amounts
    const currentResources = playerState.resources as any;
    const newResources = {
      metal: Math.floor(currentResources.metal + production.metal * timeDelta),
      crystal: Math.floor(currentResources.crystal + production.crystal * timeDelta),
      deuterium: Math.floor(currentResources.deuterium + production.deuterium * timeDelta),
      energy: production.energy, // Energy is current state, not accumulated
    };
    
    // Update database
    await db.update(playerStates)
      .set({
        resources: newResources,
        lastResourceUpdate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(playerStates.userId, userId));
    
    return {
      resources: newResources,
      production,
      timeDelta,
    };
  } catch (error) {
    console.error("Error processing resource tick:", error);
    throw error;
  }
}

/**
 * Start building construction
 */
export async function startBuilding(userId: string, buildingType: string) {
  try {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });
    
    if (!playerState) {
      throw new Error("Player state not found");
    }
    
    const buildings = playerState.buildings as any;
    const currentLevel = buildings[buildingType] || 0;
    
    // Calculate cost and time
    const cost = calculateBuildingCost(buildingType, currentLevel);
    if (!cost) {
      throw new Error("Invalid building type");
    }
    
    const buildTime = calculateBuildTime(buildingType, currentLevel, buildings.roboticsFactory || 0);
    
    // Check if player has enough resources
    const resources = playerState.resources as any;
    if (
      resources.metal < cost.metal ||
      resources.crystal < cost.crystal ||
      resources.deuterium < cost.deuterium
    ) {
      throw new Error("Insufficient resources");
    }
    
    // Deduct resources
    const newResources = {
      ...resources,
      metal: resources.metal - cost.metal,
      crystal: resources.crystal - cost.crystal,
      deuterium: resources.deuterium - cost.deuterium,
    };
    
    // Add to construction queue (using cronJobs field)
    const queue = (playerState.cronJobs as any) || [];
    const endTime = Date.now() + buildTime * 1000;
    
    queue.push({
      type: "building",
      name: buildingType,
      level: currentLevel + 1,
      startTime: Date.now(),
      endTime: endTime,
    });
    
    await db.update(playerStates)
      .set({
        resources: newResources,
        cronJobs: queue,
        updatedAt: new Date(),
      })
      .where(eq(playerStates.userId, userId));
    
    return {
      success: true,
      buildingType,
      level: currentLevel + 1,
      cost,
      buildTime,
      endTime,
    };
  } catch (error) {
    console.error("Error starting building construction:", error);
    throw error;
  }
}

/**
 * Process construction queue - complete finished buildings
 */
export async function processConstructionQueue(userId: string) {
  try {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });
    
    if (!playerState) {
      throw new Error("Player state not found");
    }
    
    const queue = (playerState.cronJobs as any) || [];
    const now = Date.now();
    const completed = [];
    const remaining = [];
    
    // Process each queue item
    for (const item of queue) {
      if (item.endTime <= now) {
        // Construction complete
        if (item.type === "building") {
          const buildings = playerState.buildings as any;
          buildings[item.name] = item.level;
          
          await db.update(playerStates)
            .set({
              buildings: buildings,
              updatedAt: new Date(),
            })
            .where(eq(playerStates.userId, userId));
          
          completed.push(item);
        }
      } else {
        remaining.push(item);
      }
    }
    
    // Update queue
    if (completed.length > 0) {
      await db.update(playerStates)
        .set({
          cronJobs: remaining,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));
    }
    
    return {
      completed,
      remaining,
    };
  } catch (error) {
    console.error("Error processing construction queue:", error);
    throw error;
  }
}

/**
 * Ship costs and stats
 */
export const SHIP_COSTS = {
  lightFighter: { metal: 3000, crystal: 1000, deuterium: 0 },
  heavyFighter: { metal: 6000, crystal: 4000, deuterium: 0 },
  cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
  battleship: { metal: 45000, crystal: 15000, deuterium: 0 },
  colonyShip: { metal: 10000, crystal: 20000, deuterium: 10000 },
  recycler: { metal: 10000, crystal: 6000, deuterium: 2000 },
  espionageProbe: { metal: 0, crystal: 1000, deuterium: 0 },
  bomber: { metal: 50000, crystal: 25000, deuterium: 15000 },
  destroyer: { metal: 60000, crystal: 50000, deuterium: 15000 },
  deathstar: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
};

/**
 * Build ships
 */
export async function buildShips(userId: string, shipType: string, quantity: number) {
  try {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });
    
    if (!playerState) {
      throw new Error("Player state not found");
    }
    
    const cost = SHIP_COSTS[shipType as keyof typeof SHIP_COSTS];
    if (!cost) {
      throw new Error("Invalid ship type");
    }
    
    const totalCost = {
      metal: cost.metal * quantity,
      crystal: cost.crystal * quantity,
      deuterium: cost.deuterium * quantity,
    };
    
    // Check resources
    const resources = playerState.resources as any;
    if (
      resources.metal < totalCost.metal ||
      resources.crystal < totalCost.crystal ||
      resources.deuterium < totalCost.deuterium
    ) {
      throw new Error("Insufficient resources");
    }
    
    // Deduct resources and add ships
    const newResources = {
      ...resources,
      metal: resources.metal - totalCost.metal,
      crystal: resources.crystal - totalCost.crystal,
      deuterium: resources.deuterium - totalCost.deuterium,
    };
    
    const units = playerState.units as any || {};
    units[shipType] = (units[shipType] || 0) + quantity;
    
    await db.update(playerStates)
      .set({
        resources: newResources,
        units: units,
        updatedAt: new Date(),
      })
      .where(eq(playerStates.userId, userId));
    
    return {
      success: true,
      shipType,
      quantity,
      cost: totalCost,
      newTotal: units[shipType],
    };
  } catch (error) {
    console.error("Error building ships:", error);
    throw error;
  }
}

export interface OgameResourceCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy?: number;
  darkMatter?: number;
}

export function calculateOgameUpgradeCost(
  baseCost: OgameResourceCost,
  level: number,
  growthFactor = 1,
  quantity = 1,
): OgameResourceCost {
  const safeLevel = Math.max(1, Math.floor(level));
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const safeGrowth = Math.max(1, growthFactor);
  const multiplier = Math.pow(safeGrowth, safeLevel - 1) * safeQuantity;

  return {
    metal: Math.ceil(baseCost.metal * multiplier),
    crystal: Math.ceil(baseCost.crystal * multiplier),
    deuterium: Math.ceil(baseCost.deuterium * multiplier),
    energy: Math.ceil((baseCost.energy || 0) * multiplier),
    darkMatter: Math.ceil((baseCost.darkMatter || 0) * multiplier),
  };
}

export function canAffordOgameCost(
  resources: { metal?: number; crystal?: number; deuterium?: number; energy?: number; darkMatter?: number },
  cost: OgameResourceCost,
) {
  return (
    (resources.metal || 0) >= cost.metal &&
    (resources.crystal || 0) >= cost.crystal &&
    (resources.deuterium || 0) >= cost.deuterium &&
    (resources.energy || 0) >= (cost.energy || 0) &&
    (resources.darkMatter || 0) >= (cost.darkMatter || 0)
  );
}

export function calculateOgameMineOutput(
  buildings: { metalMine?: number; crystalMine?: number; deuteriumSynthesizer?: number; solarPlant?: number; fusionReactor?: number },
  research: { energyTech?: number; plasmaTech?: number } = {},
) {
  const metalMine = Math.max(0, Math.floor(buildings.metalMine || 0));
  const crystalMine = Math.max(0, Math.floor(buildings.crystalMine || 0));
  const deuteriumSynthesizer = Math.max(0, Math.floor(buildings.deuteriumSynthesizer || 0));
  const solarPlant = Math.max(0, Math.floor(buildings.solarPlant || 0));
  const fusionReactor = Math.max(0, Math.floor(buildings.fusionReactor || 0));

  const energyTech = Math.max(0, Math.floor(research.energyTech || 0));
  const plasmaTech = Math.max(0, Math.floor(research.plasmaTech || 0));

  const metalRaw = 30 * metalMine * Math.pow(1.1, metalMine);
  const crystalRaw = 20 * crystalMine * Math.pow(1.1, crystalMine);
  const deuteriumRaw = 10 * deuteriumSynthesizer * Math.pow(1.1, deuteriumSynthesizer);

  const producedEnergy =
    20 * solarPlant * Math.pow(1.1, solarPlant) +
    30 * fusionReactor * Math.pow(1.05, fusionReactor) * (1 + energyTech * 0.01);

  const consumedEnergy =
    10 * metalMine * Math.pow(1.1, metalMine) +
    10 * crystalMine * Math.pow(1.1, crystalMine) +
    20 * deuteriumSynthesizer * Math.pow(1.1, deuteriumSynthesizer);

  const energyEfficiency = consumedEnergy <= 0 ? 1 : Math.min(1, producedEnergy / consumedEnergy);

  return {
    metalPerHour: Math.floor(metalRaw * energyEfficiency * (1 + plasmaTech * 0.01)),
    crystalPerHour: Math.floor(crystalRaw * energyEfficiency * (1 + plasmaTech * 0.0066)),
    deuteriumPerHour: Math.floor(deuteriumRaw * energyEfficiency * (1 + plasmaTech * 0.0033)),
    energyNet: Math.floor(producedEnergy - consumedEnergy),
    energyEfficiency: Number(energyEfficiency.toFixed(4)),
  };
}

export function calculateOgameFleetPower(
  units: Record<string, number>,
  statsByUnit: Record<string, { attack: number; shield: number; hull: number }>,
  research: { weaponsTech?: number; shieldingTech?: number; armourTech?: number } = {},
) {
  const weaponMultiplier = 1 + Math.max(0, Math.floor(research.weaponsTech || 0)) * 0.1;
  const shieldMultiplier = 1 + Math.max(0, Math.floor(research.shieldingTech || 0)) * 0.1;
  const hullMultiplier = 1 + Math.max(0, Math.floor(research.armourTech || 0)) * 0.1;

  let attack = 0;
  let shield = 0;
  let hull = 0;

  for (const [unitId, countRaw] of Object.entries(units)) {
    const count = Math.max(0, Math.floor(countRaw));
    if (!count) continue;

    const stats = statsByUnit[unitId];
    if (!stats) continue;

    attack += stats.attack * count;
    shield += stats.shield * count;
    hull += stats.hull * count;
  }

  const finalAttack = Math.round(attack * weaponMultiplier);
  const finalShield = Math.round(shield * shieldMultiplier);
  const finalHull = Math.round(hull * hullMultiplier);
  const power = Math.round(finalAttack * 0.5 + finalShield * 0.3 + finalHull * 0.2);

  return {
    attack: finalAttack,
    shield: finalShield,
    hull: finalHull,
    power,
  };
}
