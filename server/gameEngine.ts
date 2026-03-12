
import { resourceService } from './services/resourceService';
import { fleetService } from './services/fleetService';
import { technologyService } from './services/technologyService';

type ResourceCost = { metal: number; crystal: number; deuterium: number };

export const BUILDING_COSTS: Record<string, ResourceCost> = {
  metalMine: { metal: 60, crystal: 15, deuterium: 0 },
  crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
  deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
  solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
  roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100 },
};

export const SHIP_COSTS: Record<string, ResourceCost> = {
  lightFighter: { metal: 3000, crystal: 1000, deuterium: 0 },
  heavyFighter: { metal: 6000, crystal: 4000, deuterium: 0 },
  cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
  battleship: { metal: 45000, crystal: 15000, deuterium: 0 },
  battlecruiser: { metal: 30000, crystal: 40000, deuterium: 15000 },
  destroyer: { metal: 60000, crystal: 50000, deuterium: 15000 },
};

export function calculateProduction(buildings: Record<string, number> = {}, research: Record<string, number> = {}) {
  const metalMineLevel = buildings.metalMine || 0;
  const crystalMineLevel = buildings.crystalMine || 0;
  const deuteriumLevel = buildings.deuteriumSynthesizer || 0;
  const energyTech = research.energyTech || 0;

  return {
    metal: Math.floor(30 * metalMineLevel * (1 + metalMineLevel / 10)),
    crystal: Math.floor(20 * crystalMineLevel * (1 + crystalMineLevel / 10)),
    deuterium: Math.floor(10 * deuteriumLevel * (1 + deuteriumLevel / 12)),
    energy: Math.floor(20 + energyTech * 5),
  };
}

export function calculateBuildingCost(buildingType: string, currentLevel: number): ResourceCost {
  const baseCost = BUILDING_COSTS[buildingType] || BUILDING_COSTS.metalMine;
  const factor = Math.pow(1.15, Math.max(0, currentLevel));

  return {
    metal: Math.floor(baseCost.metal * factor),
    crystal: Math.floor(baseCost.crystal * factor),
    deuterium: Math.floor(baseCost.deuterium * factor),
  };
}

export function calculateBuildTime(buildingType: string, currentLevel: number, roboticsFactoryLevel: number): number {
  const cost = calculateBuildingCost(buildingType, currentLevel);
  const totalCost = cost.metal + cost.crystal + cost.deuterium;
  const roboticsModifier = 1 + Math.max(0, roboticsFactoryLevel);
  return Math.max(1, Math.ceil(totalCost / (2500 * roboticsModifier)));
}

export async function processResourceTick(userId: string) {
  return {
    userId,
    produced: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    timestamp: Date.now(),
  };
}

export async function startBuilding(userId: string, buildingType: string) {
  return {
    userId,
    buildingType,
    started: true,
    startedAt: Date.now(),
  };
}

export async function processConstructionQueue(userId: string) {
  return {
    userId,
    completed: [],
    processedAt: Date.now(),
  };
}

export async function buildShips(userId: string, shipType: string, quantity: number) {
  return {
    userId,
    shipType,
    quantity,
    builtAt: Date.now(),
  };
}

class GameEngine {
  constructor() {
    console.log('Game engine started!');
  }

  public update() {
    console.log('Game engine update');
  }

  public getResources() {
    return resourceService.getResources();
  }

  public getFleet() {
    return fleetService.getFleet();
  }

  public getTechnologyTree() {
    return technologyService.getTechnologyTree();
  }
}

export const gameEngine = new GameEngine();
