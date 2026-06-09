import type { Item, ItemRarity, ItemType } from "../../client/src/lib/commanderTypes";

export type CraftingRecipeCategory = "materials" | "components" | "equipment" | "shipyard" | "constructor";
export type CraftingRecipeOutputKind = "material" | "commander-item" | "unit" | "yard-upgrade-kit";

export interface CraftingResourceCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy?: number;
  credits?: number;
}

export type CraftingInventory = Record<string, number>;

export interface CraftingIngredient {
  itemId: string;
  amount: number;
}

export interface CraftingRequirement {
  buildings?: Record<string, number>;
  research?: Record<string, number>;
  shipyardCategory?: Record<string, number>;
  starshipLine?: Record<string, number>;
  commanderLevel?: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  category: CraftingRecipeCategory;
  outputKind: CraftingRecipeOutputKind;
  outputId: string;
  outputName: string;
  outputAmount: number;
  description: string;
  baseCost: CraftingResourceCost;
  ingredients: CraftingIngredient[];
  baseCraftTimeMs: number;
  requirements?: CraftingRequirement;
  itemType?: ItemType;
  rarity?: ItemRarity;
  itemClass?: string;
  itemSubClass?: string;
  itemSubType?: string;
  stats?: NonNullable<Item["stats"]>;
}

export interface CraftingQueueItem {
  id: string;
  recipeId: string;
  recipeName: string;
  outputId: string;
  outputName: string;
  outputKind: CraftingRecipeOutputKind;
  amount: number;
  startedAt: number;
  endsAt: number;
  status: "running" | "completed";
}

export interface CraftingCheckResult {
  ok: boolean;
  reasons: string[];
}

export interface CraftingCompletionResult {
  inventory: CraftingInventory;
  item?: Item;
  unitId?: string;
  unitAmount?: number;
}

export const CRAFTING_MATERIALS = {
  PLASTEEL: "plasteel",
  CIRCUIT_BOARD: "circuit_board",
  REFINED_ALLOY: "refined_alloy",
  QUANTUM_FILAMENT: "quantum_filament",
  REACTOR_CORE: "reactor_core",
  NAV_COMPUTER: "nav_computer",
  HULL_SEGMENT: "hull_segment",
  SHIELD_MATRIX: "shield_matrix",
  WEAPON_MOUNT: "weapon_mount",
  CONSTRUCTOR_CORE: "constructor_core",
} as const;

export const CRAFTING_RECIPES: readonly CraftingRecipe[] = [
  {
    id: "craft-refined-alloy",
    name: "Refined Alloy Batch",
    category: "materials",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.REFINED_ALLOY,
    outputName: "Refined Alloy",
    outputAmount: 4,
    description: "Smelt metal and crystal into construction-grade alloy for hulls and station frames.",
    baseCost: { metal: 1200, crystal: 350, deuterium: 0, energy: 25 },
    ingredients: [],
    baseCraftTimeMs: 20_000,
  },
  {
    id: "craft-quantum-filament",
    name: "Quantum Filament Spool",
    category: "materials",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.QUANTUM_FILAMENT,
    outputName: "Quantum Filament",
    outputAmount: 2,
    description: "Draw crystal lattices into high-grade filament for shields, sensors, and advanced drives.",
    baseCost: { metal: 300, crystal: 1500, deuterium: 250, energy: 35 },
    ingredients: [{ itemId: CRAFTING_MATERIALS.CIRCUIT_BOARD, amount: 1 }],
    baseCraftTimeMs: 28_000,
    requirements: { research: { energyTech: 1 } },
  },
  {
    id: "craft-reactor-core",
    name: "Compact Reactor Core",
    category: "components",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.REACTOR_CORE,
    outputName: "Compact Reactor Core",
    outputAmount: 1,
    description: "Build a modular power core for ships, commander armor, and constructor-yard upgrades.",
    baseCost: { metal: 2200, crystal: 1800, deuterium: 900, energy: 80 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.REFINED_ALLOY, amount: 2 },
      { itemId: CRAFTING_MATERIALS.QUANTUM_FILAMENT, amount: 1 },
    ],
    baseCraftTimeMs: 45_000,
    requirements: { buildings: { researchLab: 1 }, research: { energyTech: 2 } },
  },
  {
    id: "craft-nav-computer",
    name: "Navigation Computer",
    category: "components",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.NAV_COMPUTER,
    outputName: "Navigation Computer",
    outputAmount: 1,
    description: "Assemble a command-grade navigation computer for colony ships and logistics modules.",
    baseCost: { metal: 900, crystal: 2600, deuterium: 600, energy: 45 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.CIRCUIT_BOARD, amount: 2 },
      { itemId: CRAFTING_MATERIALS.QUANTUM_FILAMENT, amount: 1 },
    ],
    baseCraftTimeMs: 38_000,
    requirements: { research: { computerTech: 1 } },
  },
  {
    id: "craft-hull-segment",
    name: "Starship Hull Segment",
    category: "shipyard",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.HULL_SEGMENT,
    outputName: "Starship Hull Segment",
    outputAmount: 1,
    description: "Fabricate reinforced hull segments used by starship line work orders.",
    baseCost: { metal: 5200, crystal: 1700, deuterium: 400, energy: 60 },
    ingredients: [{ itemId: CRAFTING_MATERIALS.REFINED_ALLOY, amount: 4 }],
    baseCraftTimeMs: 50_000,
    requirements: { buildings: { shipyard: 2, roboticsFactory: 2 } },
  },
  {
    id: "craft-shield-matrix",
    name: "Shield Matrix Assembly",
    category: "shipyard",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.SHIELD_MATRIX,
    outputName: "Shield Matrix Assembly",
    outputAmount: 1,
    description: "Fabricate a shield matrix for defensive hulls and commander shield equipment.",
    baseCost: { metal: 1800, crystal: 4600, deuterium: 1300, energy: 90 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.QUANTUM_FILAMENT, amount: 2 },
      { itemId: CRAFTING_MATERIALS.REACTOR_CORE, amount: 1 },
    ],
    baseCraftTimeMs: 62_000,
    requirements: { research: { shieldingTech: 2 } },
  },
  {
    id: "craft-weapon-mount",
    name: "Weapon Mount Assembly",
    category: "shipyard",
    outputKind: "material",
    outputId: CRAFTING_MATERIALS.WEAPON_MOUNT,
    outputName: "Weapon Mount Assembly",
    outputAmount: 1,
    description: "Construct stabilized weapon hardpoints for ship and commander weapon crafting.",
    baseCost: { metal: 3600, crystal: 2400, deuterium: 900, energy: 70 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.REFINED_ALLOY, amount: 2 },
      { itemId: CRAFTING_MATERIALS.CIRCUIT_BOARD, amount: 2 },
    ],
    baseCraftTimeMs: 55_000,
    requirements: { research: { laserTech: 2 } },
  },
  {
    id: "craft-constructor-core",
    name: "Constructor Yard Core",
    category: "constructor",
    outputKind: "yard-upgrade-kit",
    outputId: CRAFTING_MATERIALS.CONSTRUCTOR_CORE,
    outputName: "Constructor Yard Core",
    outputAmount: 1,
    description: "A dense yard-control core used to accelerate advanced constructor dock upgrades.",
    baseCost: { metal: 9000, crystal: 7000, deuterium: 4500, energy: 140 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.HULL_SEGMENT, amount: 1 },
      { itemId: CRAFTING_MATERIALS.REACTOR_CORE, amount: 1 },
      { itemId: CRAFTING_MATERIALS.NAV_COMPUTER, amount: 1 },
    ],
    baseCraftTimeMs: 90_000,
    requirements: { buildings: { shipyard: 4, roboticsFactory: 3 } },
  },
  {
    id: "craft-command-blade",
    name: "Aegis Command Blade",
    category: "equipment",
    outputKind: "commander-item",
    outputId: "crafted-aegis-command-blade",
    outputName: "Aegis Command Blade",
    outputAmount: 1,
    description: "Commander weapon that improves warfare and engineering coordination.",
    baseCost: { metal: 4200, crystal: 1800, deuterium: 600, energy: 35 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.WEAPON_MOUNT, amount: 1 },
      { itemId: CRAFTING_MATERIALS.REFINED_ALLOY, amount: 2 },
    ],
    baseCraftTimeMs: 48_000,
    requirements: { commanderLevel: 1 },
    itemType: "weapon",
    rarity: "rare",
    itemClass: "Command",
    itemSubClass: "Blade",
    itemSubType: "aegis",
    stats: { warfare: 4, engineering: 2 },
  },
  {
    id: "craft-logistics-rig",
    name: "Logistics Fabricator Rig",
    category: "equipment",
    outputKind: "commander-item",
    outputId: "crafted-logistics-fabricator-rig",
    outputName: "Logistics Fabricator Rig",
    outputAmount: 1,
    description: "Commander module that improves logistics and crafting throughput.",
    baseCost: { metal: 2600, crystal: 3200, deuterium: 900, energy: 45 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.NAV_COMPUTER, amount: 1 },
      { itemId: CRAFTING_MATERIALS.CIRCUIT_BOARD, amount: 3 },
    ],
    baseCraftTimeMs: 52_000,
    requirements: { commanderLevel: 1 },
    itemType: "module",
    rarity: "epic",
    itemClass: "Logistics",
    itemSubClass: "Fabricator",
    itemSubType: "rig",
    stats: { logistics: 5, engineering: 3 },
  },
  {
    id: "craft-colony-ark-kit",
    name: "Colony Ark Kit",
    category: "constructor",
    outputKind: "unit",
    outputId: "colonyShip",
    outputName: "Colony Ship",
    outputAmount: 1,
    description: "A complete colony ship fabrication kit assembled through the constructor yard.",
    baseCost: { metal: 9000, crystal: 6200, deuterium: 3600, energy: 100 },
    ingredients: [
      { itemId: CRAFTING_MATERIALS.HULL_SEGMENT, amount: 2 },
      { itemId: CRAFTING_MATERIALS.NAV_COMPUTER, amount: 1 },
      { itemId: CRAFTING_MATERIALS.REACTOR_CORE, amount: 1 },
    ],
    baseCraftTimeMs: 120_000,
    requirements: { buildings: { shipyard: 4 }, research: { astrophysics: 1 } },
  },
] as const;

export function getCraftingRecipeById(recipeId: string): CraftingRecipe | undefined {
  return CRAFTING_RECIPES.find((recipe) => recipe.id === recipeId);
}

export function getCraftingRecipesByCategory(category: CraftingRecipeCategory): CraftingRecipe[] {
  return CRAFTING_RECIPES.filter((recipe) => recipe.category === category);
}

export function calculateCraftingCost(recipe: CraftingRecipe, amount: number = 1): CraftingResourceCost {
  const safeAmount = Math.max(1, Math.floor(amount));
  return {
    metal: recipe.baseCost.metal * safeAmount,
    crystal: recipe.baseCost.crystal * safeAmount,
    deuterium: recipe.baseCost.deuterium * safeAmount,
    energy: (recipe.baseCost.energy || 0) * safeAmount,
    credits: (recipe.baseCost.credits || 0) * safeAmount,
  };
}

export function calculateCraftingIngredients(recipe: CraftingRecipe, amount: number = 1): CraftingIngredient[] {
  const safeAmount = Math.max(1, Math.floor(amount));
  return recipe.ingredients.map((ingredient) => ({
    itemId: ingredient.itemId,
    amount: ingredient.amount * safeAmount,
  }));
}

export function calculateCraftingTimeMs(recipe: CraftingRecipe, amount: number = 1, speedMultiplier: number = 1): number {
  const safeAmount = Math.max(1, Math.floor(amount));
  const safeSpeed = Math.max(0.1, speedMultiplier || 1);
  return Math.max(1000, Math.ceil((recipe.baseCraftTimeMs * safeAmount) / safeSpeed));
}

export function canCraftRecipe(input: {
  recipe: CraftingRecipe;
  amount?: number;
  resources: Partial<CraftingResourceCost>;
  inventory: CraftingInventory;
  buildings?: Record<string, number>;
  research?: Record<string, number>;
  shipyardCategorySystems?: Record<string, number>;
  starshipLineSystems?: Record<string, number>;
  commanderLevel?: number;
}): CraftingCheckResult {
  const amount = Math.max(1, Math.floor(input.amount || 1));
  const cost = calculateCraftingCost(input.recipe, amount);
  const reasons: string[] = [];

  for (const resource of ["metal", "crystal", "deuterium", "energy", "credits"] as const) {
    const required = cost[resource] || 0;
    if (required > 0 && (input.resources[resource] || 0) < required) {
      reasons.push(`Needs ${required.toLocaleString()} ${resource}.`);
    }
  }

  for (const ingredient of calculateCraftingIngredients(input.recipe, amount)) {
    if ((input.inventory[ingredient.itemId] || 0) < ingredient.amount) {
      reasons.push(`Needs ${ingredient.amount}x ${ingredient.itemId}.`);
    }
  }

  const requirements = input.recipe.requirements;
  if (requirements?.buildings) {
    for (const [building, level] of Object.entries(requirements.buildings)) {
      if ((input.buildings?.[building] || 0) < level) {
        reasons.push(`Requires ${building} level ${level}.`);
      }
    }
  }

  if (requirements?.research) {
    for (const [tech, level] of Object.entries(requirements.research)) {
      if ((input.research?.[tech] || 0) < level) {
        reasons.push(`Requires ${tech} level ${level}.`);
      }
    }
  }

  if (requirements?.shipyardCategory) {
    for (const [track, level] of Object.entries(requirements.shipyardCategory)) {
      if ((input.shipyardCategorySystems?.[track] || 0) < level) {
        reasons.push(`Requires shipyard category ${track} level ${level}.`);
      }
    }
  }

  if (requirements?.starshipLine) {
    for (const [line, level] of Object.entries(requirements.starshipLine)) {
      if ((input.starshipLineSystems?.[line] || 0) < level) {
        reasons.push(`Requires starship line ${line} level ${level}.`);
      }
    }
  }

  if (requirements?.commanderLevel && (input.commanderLevel || 0) < requirements.commanderLevel) {
    reasons.push(`Requires commander level ${requirements.commanderLevel}.`);
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}

export function consumeCraftingInputs(input: {
  recipe: CraftingRecipe;
  amount?: number;
  resources: CraftingResourceCost;
  inventory: CraftingInventory;
}) {
  const amount = Math.max(1, Math.floor(input.amount || 1));
  const cost = calculateCraftingCost(input.recipe, amount);
  const inventory = { ...input.inventory };

  for (const ingredient of calculateCraftingIngredients(input.recipe, amount)) {
    inventory[ingredient.itemId] = Math.max(0, (inventory[ingredient.itemId] || 0) - ingredient.amount);
  }

  return {
    resources: {
      ...input.resources,
      metal: input.resources.metal - cost.metal,
      crystal: input.resources.crystal - cost.crystal,
      deuterium: input.resources.deuterium - cost.deuterium,
      energy: (input.resources.energy || 0) - (cost.energy || 0),
      credits: (input.resources.credits || 0) - (cost.credits || 0),
    },
    inventory,
  };
}

export function completeCraftingRecipe(recipe: CraftingRecipe, inventory: CraftingInventory, amount: number = 1): CraftingCompletionResult {
  const safeAmount = Math.max(1, Math.floor(amount));
  const outputAmount = recipe.outputAmount * safeAmount;
  const nextInventory = { ...inventory };

  if (recipe.outputKind === "material" || recipe.outputKind === "yard-upgrade-kit") {
    nextInventory[recipe.outputId] = (nextInventory[recipe.outputId] || 0) + outputAmount;
    return { inventory: nextInventory };
  }

  if (recipe.outputKind === "unit") {
    return {
      inventory: nextInventory,
      unitId: recipe.outputId,
      unitAmount: outputAmount,
    };
  }

  const item: Item = {
    id: `${recipe.outputId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: recipe.outputName,
    description: recipe.description,
    type: recipe.itemType || "module",
    rarity: recipe.rarity || "common",
    level: 1,
    itemClass: recipe.itemClass,
    itemSubClass: recipe.itemSubClass,
    itemSubType: recipe.itemSubType,
    stats: recipe.stats,
    tempering: 0,
  };

  return { inventory: nextInventory, item };
}
