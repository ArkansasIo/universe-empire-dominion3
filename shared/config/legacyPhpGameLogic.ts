import {
  LEGACY_PHP_GAME_CONFIG,
  calculateLegacyMarketPrice,
  calculateLegacyPlanetProduction,
  calculateLegacyPortProduction,
  getLegacyRaceSystemBonus,
  type LegacyResourceKey,
} from './legacyPhpGameConfig';

export type LegacySchedulerEvent =
  | 'turns'
  | 'ports'
  | 'planets'
  | 'igb'
  | 'ranking'
  | 'news'
  | 'degrade'
  | 'apocalypse'
  | 'governor'
  | 'empire';

export interface LegacySchedulerEventState {
  event: LegacySchedulerEvent;
  intervalMinutes: number;
  dueRuns: number;
  nextRunAt: number;
}

export interface LegacyPlanetProductionInput {
  colonists: number;
  organics: number;
  fighters?: number;
  orePercent?: number;
  organicsPercent?: number;
  goodsPercent?: number;
  energyPercent?: number;
  fightersPercent?: number;
  torpedoesPercent?: number;
  ticks?: number;
}

export interface LegacyPlanetProductionResult {
  resources: Record<LegacyResourceKey, number>;
  fighters: number;
  torpedoes: number;
  credits: number;
  colonists: number;
  organicsConsumed: number;
  colonistsLostToStarvation: number;
  energyMaintenance: number;
}

export interface LegacyBankAccountInput {
  balance: number;
  loanBalance?: number;
  netWorth?: number;
  minutes?: number;
}

export interface LegacyBankAccountResult {
  balance: number;
  interestEarned: number;
  loanBalance: number;
  loanInterestAccrued: number;
  maxLoan: number;
  oneTimeLoanFee: number;
}

export interface LegacyDeviceInventory {
  genesis?: number;
  emergencyWarp?: number;
  beacons?: number;
  warpEditors?: number;
  mineDeflectors?: number;
  escapePods?: number;
  fuelScoops?: number;
  lastSeenShipDevices?: number;
}

export interface LegacyDevicePurchaseResult {
  ok: boolean;
  reasons: string[];
  creditsRemaining: number;
  inventory: Required<LegacyDeviceInventory>;
}

export interface LegacyShipTechProfile {
  hull: number;
  engines: number;
  power: number;
  computer: number;
  sensors: number;
  armor: number;
  shields: number;
  beams: number;
  torpLaunchers: number;
  cloak: number;
}

export interface LegacyBountyInput {
  attackerNetWorth: number;
  defenderNetWorth: number;
  attackerTurns: number;
  requestedBounty?: number;
}

export interface LegacyBountyResult {
  applies: boolean;
  maxBounty: number;
  bounty: number;
  blocksSpecialPorts: boolean;
  reason: string;
}

export interface LegacyScanInput {
  scannerSensors: number;
  targetCloak: number;
  fullScan?: boolean;
}

export interface LegacyCaptureInput {
  shipValue: number;
  planetValue: number;
  hasRequiredBases?: boolean;
}

export interface LegacyServerAccessResult {
  canLogin: boolean;
  canCreateAccount: boolean;
  reason: string;
}

const schedulerIntervals: Record<LegacySchedulerEvent, number> = {
  turns: LEGACY_PHP_GAME_CONFIG.schedule.turns,
  ports: LEGACY_PHP_GAME_CONFIG.schedule.ports,
  planets: LEGACY_PHP_GAME_CONFIG.schedule.planets,
  igb: LEGACY_PHP_GAME_CONFIG.schedule.igb,
  ranking: LEGACY_PHP_GAME_CONFIG.schedule.ranking,
  news: LEGACY_PHP_GAME_CONFIG.schedule.news,
  degrade: LEGACY_PHP_GAME_CONFIG.schedule.degrade,
  apocalypse: LEGACY_PHP_GAME_CONFIG.schedule.apocalypse,
  governor: LEGACY_PHP_GAME_CONFIG.schedule.governor,
  empire: LEGACY_PHP_GAME_CONFIG.schedule.empire,
};

const deviceConfig = {
  genesis: {
    price: LEGACY_PHP_GAME_CONFIG.devices.genesisPrice,
    max: LEGACY_PHP_GAME_CONFIG.devices.maxGenesis,
    enabled: LEGACY_PHP_GAME_CONFIG.rules.allowGenesisDestroy,
  },
  emergencyWarp: {
    price: LEGACY_PHP_GAME_CONFIG.devices.emergencyWarpPrice,
    max: LEGACY_PHP_GAME_CONFIG.devices.maxEmergencyWarp,
    enabled: true,
  },
  beacons: {
    price: LEGACY_PHP_GAME_CONFIG.devices.beaconPrice,
    max: LEGACY_PHP_GAME_CONFIG.devices.maxBeacons,
    enabled: true,
  },
  warpEditors: {
    price: LEGACY_PHP_GAME_CONFIG.devices.warpEditorPrice,
    max: LEGACY_PHP_GAME_CONFIG.devices.maxWarpEditors,
    enabled: true,
  },
  mineDeflectors: {
    price: LEGACY_PHP_GAME_CONFIG.devices.mineDeflectorPrice,
    max: LEGACY_PHP_GAME_CONFIG.devices.maxUpgradeDevices,
    enabled: true,
  },
  escapePods: {
    price: LEGACY_PHP_GAME_CONFIG.devices.escapePodPrice,
    max: 1,
    enabled: true,
  },
  fuelScoops: {
    price: LEGACY_PHP_GAME_CONFIG.devices.fuelScoopPrice,
    max: 1,
    enabled: true,
  },
  lastSeenShipDevices: {
    price: LEGACY_PHP_GAME_CONFIG.devices.lastSeenShipDevicePrice,
    max: 1,
    enabled: true,
  },
} as const;

function clamp(value: number, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function getLegacySchedulerPlan(now = Date.now(), lastRunByEvent: Partial<Record<LegacySchedulerEvent, number>> = {}): LegacySchedulerEventState[] {
  return (Object.entries(schedulerIntervals) as [LegacySchedulerEvent, number][]).map(([event, intervalMinutes]) => {
    const intervalMs = intervalMinutes * 60_000;
    const lastRunAt = lastRunByEvent[event] ?? now;
    const elapsed = Math.max(0, now - lastRunAt);
    const dueRuns = Math.floor(elapsed / intervalMs);

    return {
      event,
      intervalMinutes,
      dueRuns,
      nextRunAt: dueRuns > 0 ? lastRunAt + (dueRuns + 1) * intervalMs : lastRunAt + intervalMs,
    };
  });
}

export function calculateLegacyUpgradeCost(currentLevel: number, targetLevel: number): number {
  const levelDelta = Math.max(0, Math.floor(targetLevel) - Math.floor(currentLevel));
  if (levelDelta === 0) return 0;
  return Math.floor(LEGACY_PHP_GAME_CONFIG.economy.upgradeCost * Math.pow(LEGACY_PHP_GAME_CONFIG.economy.upgradeFactor, levelDelta));
}

export function calculateLegacyTechEffect(baseValue: number, level: number): number {
  return baseValue * Math.pow(LEGACY_PHP_GAME_CONFIG.economy.levelFactor, Math.max(0, level));
}

export function calculateLegacyBankTick(input: LegacyBankAccountInput): LegacyBankAccountResult {
  const banking = LEGACY_PHP_GAME_CONFIG.economy.banking;
  const minutes = clamp(input.minutes ?? banking.loanRepaymentMinutes, 0);
  const tickScale = minutes / Math.max(1, banking.loanRepaymentMinutes);
  const balance = clamp(input.balance, 0, banking.maxCreditsAllowed);
  const loanBalance = clamp(input.loanBalance ?? 0);
  const netWorth = clamp(input.netWorth ?? balance);
  const maxLoan = Math.floor(netWorth * banking.loanLimit);
  const interestEarned = Math.floor(balance * banking.interest * tickScale);
  const loanInterestAccrued = Math.floor(loanBalance * banking.loanInterest * tickScale);

  return {
    balance: Math.min(banking.maxCreditsAllowed, balance + interestEarned),
    interestEarned,
    loanBalance: loanBalance + loanInterestAccrued,
    loanInterestAccrued,
    maxLoan,
    oneTimeLoanFee: Math.floor(maxLoan * banking.loanFactor),
  };
}

export function calculateLegacyTransferFee(amount: number): number {
  return Math.floor(clamp(amount) * LEGACY_PHP_GAME_CONFIG.economy.banking.paymentFee);
}

export function calculateLegacyPlanetProductionDetail(input: LegacyPlanetProductionInput): LegacyPlanetProductionResult {
  const ticks = Math.max(1, Math.floor(input.ticks ?? 1));
  const colonists = clamp(input.colonists, 0, LEGACY_PHP_GAME_CONFIG.production.colonistLimit);
  const organics = clamp(input.organics);
  const fighters = clamp(input.fighters ?? 0);
  const resources = {
    ore: calculateLegacyPlanetProduction('ore', input.orePercent ?? LEGACY_PHP_GAME_CONFIG.economy.defaultPlanetProductionPercent.ore, ticks),
    organics: calculateLegacyPlanetProduction('organics', input.organicsPercent ?? LEGACY_PHP_GAME_CONFIG.economy.defaultPlanetProductionPercent.organics, ticks),
    goods: calculateLegacyPlanetProduction('goods', input.goodsPercent ?? LEGACY_PHP_GAME_CONFIG.economy.defaultPlanetProductionPercent.goods, ticks),
    energy: calculateLegacyPlanetProduction('energy', input.energyPercent ?? LEGACY_PHP_GAME_CONFIG.economy.defaultPlanetProductionPercent.energy, ticks),
  };
  const organicsConsumed = Math.floor(colonists * LEGACY_PHP_GAME_CONFIG.production.organicsConsumption * ticks);
  const organicsShortfall = Math.max(0, organicsConsumed - organics);
  const starvationPressure = organicsConsumed > 0 ? organicsShortfall / organicsConsumed : 0;
  const colonistsLostToStarvation = Math.floor(colonists * LEGACY_PHP_GAME_CONFIG.production.starvationDeathRate * starvationPressure);
  const survivingColonists = Math.max(0, colonists - colonistsLostToStarvation);
  const newColonists = Math.min(
    LEGACY_PHP_GAME_CONFIG.production.colonistLimit,
    survivingColonists + Math.floor(survivingColonists * LEGACY_PHP_GAME_CONFIG.production.colonistReproductionRate * ticks),
  );

  return {
    resources,
    fighters: Math.floor(colonists * LEGACY_PHP_GAME_CONFIG.production.fighterPlanetRate * ((input.fightersPercent ?? 10) / 100) * ticks),
    torpedoes: Math.floor(colonists * LEGACY_PHP_GAME_CONFIG.production.torpedoPlanetRate * ((input.torpedoesPercent ?? 10) / 100) * ticks),
    credits: Math.floor(colonists * LEGACY_PHP_GAME_CONFIG.production.creditsPlanetRate * ticks),
    colonists: newColonists,
    organicsConsumed,
    colonistsLostToStarvation,
    energyMaintenance: Math.ceil(fighters * LEGACY_PHP_GAME_CONFIG.production.energyPerFighter * ticks),
  };
}

export function calculateLegacyPortManifest(ticks = 1): Record<LegacyResourceKey, { minPrice: number; basePrice: number; maxPrice: number; regenerated: number; limit: number }> {
  return (Object.keys(LEGACY_PHP_GAME_CONFIG.economy.resources) as LegacyResourceKey[]).reduce((manifest, resource) => {
    const config = LEGACY_PHP_GAME_CONFIG.economy.resources[resource];
    manifest[resource] = {
      minPrice: calculateLegacyMarketPrice(resource, 'min'),
      basePrice: calculateLegacyMarketPrice(resource, 'base'),
      maxPrice: calculateLegacyMarketPrice(resource, 'max'),
      regenerated: calculateLegacyPortProduction(resource, ticks),
      limit: config.limit,
    };
    return manifest;
  }, {} as Record<LegacyResourceKey, { minPrice: number; basePrice: number; maxPrice: number; regenerated: number; limit: number }>);
}

export function purchaseLegacyDevice(device: keyof typeof deviceConfig, credits: number, inventory: LegacyDeviceInventory = {}, quantity = 1): LegacyDevicePurchaseResult {
  const config = deviceConfig[device];
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const currentInventory: Required<LegacyDeviceInventory> = {
    genesis: inventory.genesis ?? 0,
    emergencyWarp: inventory.emergencyWarp ?? 0,
    beacons: inventory.beacons ?? 0,
    warpEditors: inventory.warpEditors ?? 0,
    mineDeflectors: inventory.mineDeflectors ?? 0,
    escapePods: inventory.escapePods ?? 0,
    fuelScoops: inventory.fuelScoops ?? 0,
    lastSeenShipDevices: inventory.lastSeenShipDevices ?? 0,
  };
  const reasons: string[] = [];
  const totalCost = config.price * safeQuantity;

  if (!config.enabled) reasons.push(`${device} is disabled by game rules.`);
  if (currentInventory[device] + safeQuantity > config.max) reasons.push(`${device} cap is ${config.max}.`);
  if (credits < totalCost) reasons.push(`Needs ${totalCost.toLocaleString()} credits.`);

  if (reasons.length === 0) {
    currentInventory[device] += safeQuantity;
  }

  return {
    ok: reasons.length === 0,
    reasons,
    creditsRemaining: reasons.length === 0 ? credits - totalCost : credits,
    inventory: currentInventory,
  };
}

export function shouldRegenerateNewbieShip(profile: LegacyShipTechProfile, destroyedWithoutEmergencyWarp: boolean): boolean {
  if (!destroyedWithoutEmergencyWarp || !LEGACY_PHP_GAME_CONFIG.newbieRegen.enabled) return false;
  const limits = LEGACY_PHP_GAME_CONFIG.newbieRegen;
  return (
    profile.hull < limits.hull &&
    profile.engines < limits.engines &&
    profile.power < limits.power &&
    profile.computer < limits.computer &&
    profile.sensors < limits.sensors &&
    profile.armor < limits.armor &&
    profile.shields < limits.shields &&
    profile.beams < limits.beams &&
    profile.torpLaunchers < limits.torpLaunchers &&
    profile.cloak < limits.cloak
  );
}

export function calculateLegacyBounty(input: LegacyBountyInput): LegacyBountyResult {
  const defenderWorth = clamp(input.defenderNetWorth);
  const attackerWorth = clamp(input.attackerNetWorth);
  const maxBounty = Math.floor(attackerWorth * LEGACY_PHP_GAME_CONFIG.bounty.maxValue);

  if (input.attackerTurns < LEGACY_PHP_GAME_CONFIG.bounty.minTurns) {
    return { applies: false, maxBounty, bounty: 0, blocksSpecialPorts: false, reason: 'attacker_below_min_turns' };
  }

  if (defenderWorth <= 0 || attackerWorth / defenderWorth < LEGACY_PHP_GAME_CONFIG.bounty.ratio) {
    return { applies: false, maxBounty, bounty: 0, blocksSpecialPorts: false, reason: 'net_worth_ratio_not_met' };
  }

  const requested = input.requestedBounty ?? maxBounty;
  return {
    applies: true,
    maxBounty,
    bounty: Math.min(maxBounty, clamp(requested)),
    blocksSpecialPorts: LEGACY_PHP_GAME_CONFIG.bounty.blockAllSpecialPorts,
    reason: 'bounty_applies',
  };
}

export function calculateLegacyRealspaceTurnCost(distance: number, engineLevel: number): number {
  const scaledDistance = clamp(distance) / LEGACY_PHP_GAME_CONFIG.universe.universeSize;
  const engineFactor = Math.max(1, calculateLegacyTechEffect(1, engineLevel));
  return Math.max(1, Math.ceil(scaledDistance / engineFactor));
}

export function getLegacyServerAccess(): LegacyServerAccessResult {
  if (LEGACY_PHP_GAME_CONFIG.rules.serverClosed) {
    return {
      canLogin: false,
      canCreateAccount: !LEGACY_PHP_GAME_CONFIG.rules.accountCreationClosed,
      reason: 'server_closed',
    };
  }

  return {
    canLogin: true,
    canCreateAccount: !LEGACY_PHP_GAME_CONFIG.rules.accountCreationClosed,
    reason: LEGACY_PHP_GAME_CONFIG.rules.accountCreationClosed ? 'account_creation_closed' : 'open',
  };
}

export function calculateLegacyScan(input: LegacyScanInput) {
  const fullScanAllowed = LEGACY_PHP_GAME_CONFIG.rules.allowFullScan;
  const usingFullScan = Boolean(input.fullScan && fullScanAllowed);
  const sensorScore = clamp(input.scannerSensors);
  const cloakScore = clamp(input.targetCloak);
  const errorAdjustedCloak = cloakScore * (1 + LEGACY_PHP_GAME_CONFIG.rules.scanErrorFactor / 100);
  const baseAccuracy = sensorScore + errorAdjustedCloak === 0
    ? 100
    : (sensorScore / (sensorScore + errorAdjustedCloak)) * 100;
  const accuracy = clamp(usingFullScan ? baseAccuracy + 20 : baseAccuracy, 5, 100);

  return {
    allowed: !input.fullScan || fullScanAllowed,
    fullScan: usingFullScan,
    turnCost: usingFullScan ? LEGACY_PHP_GAME_CONFIG.rules.fullScanCost : 0,
    accuracy: Math.round(accuracy * 100) / 100,
    errorChance: Math.round((100 - accuracy) * 100) / 100,
  };
}

export function shouldTowFromFederation(hullLevel: number, score: number): boolean {
  return hullLevel > LEGACY_PHP_GAME_CONFIG.rules.fedMaxHull || score > LEGACY_PHP_GAME_CONFIG.rules.fedMaxScore;
}

export function canCaptureLegacyPlanet(input: LegacyCaptureInput) {
  if (!input.hasRequiredBases) {
    return { ok: false, reason: 'sector_base_requirement_not_met' };
  }

  if (LEGACY_PHP_GAME_CONFIG.rules.minValueCapture <= 0) {
    return { ok: true, reason: 'capture_value_rule_disabled' };
  }

  const requiredShipValue = clamp(input.planetValue) * LEGACY_PHP_GAME_CONFIG.rules.minValueCapture;
  return {
    ok: clamp(input.shipValue) >= requiredShipValue,
    reason: clamp(input.shipValue) >= requiredShipValue ? 'capture_allowed' : 'ship_value_too_low',
    requiredShipValue,
  };
}

export function clampLegacyPlanetCredits(credits: number, hasBase: boolean): number {
  if (hasBase) return Math.min(clamp(credits), LEGACY_PHP_GAME_CONFIG.economy.banking.planetMaxCredits);
  return Math.min(clamp(credits), LEGACY_PHP_GAME_CONFIG.rules.maxCreditsWithoutBase);
}

export function calculateLegacyDefenseDegradation(defenses: number, supportingEnergy: number): number {
  const energyRequired = defenses * LEGACY_PHP_GAME_CONFIG.production.energyPerFighter;
  if (supportingEnergy >= energyRequired) return defenses;
  return Math.floor(clamp(defenses) * (1 - LEGACY_PHP_GAME_CONFIG.production.defenseDegradeRate));
}

export function calculateLegacySpacePlague(colonists: number): number {
  return Math.max(0, Math.floor(clamp(colonists) * (1 - LEGACY_PHP_GAME_CONFIG.production.spacePlagueKills)));
}

export function canBuildLegacyBase(resources: { ore?: number; goods?: number; organics?: number; credits?: number }) {
  const requirements = LEGACY_PHP_GAME_CONFIG.production.baseRequirements;
  const reasons: string[] = [];
  if ((resources.ore ?? 0) < requirements.ore) reasons.push(`Needs ${requirements.ore.toLocaleString()} ore.`);
  if ((resources.goods ?? 0) < requirements.goods) reasons.push(`Needs ${requirements.goods.toLocaleString()} goods.`);
  if ((resources.organics ?? 0) < requirements.organics) reasons.push(`Needs ${requirements.organics.toLocaleString()} organics.`);
  if ((resources.credits ?? 0) < requirements.credits) reasons.push(`Needs ${requirements.credits.toLocaleString()} credits.`);
  return { ok: reasons.length === 0, reasons, requirements };
}

export function calculateLegacyMineHitChance(hullSize: number, mineCount: number, mineDeflectors = 0): number {
  if (hullSize < LEGACY_PHP_GAME_CONFIG.rules.mineHullSize || mineCount <= 0) return 0;
  const adjustedMines = Math.max(0, mineCount - mineDeflectors);
  return clamp((adjustedMines / Math.max(1, adjustedMines + 100)) * 100, 0, 95);
}

export function calculateLegacyEmergencyWarpDegrade(hullSize: number, emergencyWarpDevices: number): number {
  if (hullSize <= LEGACY_PHP_GAME_CONFIG.rules.ewdMaxHullSize) return emergencyWarpDevices;
  const overage = hullSize - LEGACY_PHP_GAME_CONFIG.rules.ewdMaxHullSize;
  return Math.max(0, Math.floor(emergencyWarpDevices - overage));
}

export function canUseLegacyShipTransfer(senderValue: number, transferValue: number, turnsPlayed: number, minutesSinceSimilarTransfer: number) {
  const banking = LEGACY_PHP_GAME_CONFIG.economy.banking;
  const reasons: string[] = [];
  if (banking.shipTransferMinTurns > 0 && turnsPlayed < banking.shipTransferMinTurns) {
    reasons.push(`Requires ${banking.shipTransferMinTurns} turns played.`);
  }
  if (banking.shipTransferSenderValueLimit > 0 && transferValue > senderValue * banking.shipTransferSenderValueLimit) {
    reasons.push(`Transfer exceeds ${banking.shipTransferSenderValueLimit * 100}% of sender value.`);
  }
  if (banking.shipTransferCooldownMinutes > 0 && minutesSinceSimilarTransfer < banking.shipTransferCooldownMinutes) {
    reasons.push(`Requires ${banking.shipTransferCooldownMinutes} minutes between similar transfers.`);
  }
  return { ok: reasons.length === 0, reasons };
}

export function formatLegacyNumber(value: number): string {
  const { numberDecimalPoint, numberThousandsSeparator } = LEGACY_PHP_GAME_CONFIG.localization;
  const [whole, decimal] = String(value).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, numberThousandsSeparator);
  return decimal ? `${grouped}${numberDecimalPoint}${decimal}` : grouped;
}

export function getLegacyAdminPublicInfo() {
  const { email, name, emailServer, forumUrl } = LEGACY_PHP_GAME_CONFIG.admin;
  return { email, name, emailServer, forumUrl };
}

export function getLegacyIntegrationInfo() {
  return LEGACY_PHP_GAME_CONFIG.integrations;
}

export function getLegacyRaceOperationsProfile(raceCode: string) {
  const bonuses = getLegacyRaceSystemBonus(raceCode);
  return {
    productionMultiplier: bonuses.production,
    combatMultiplier: bonuses.combat,
    researchMultiplier: bonuses.research,
    tradeFeeMultiplier: 1 / bonuses.trade,
    stealthMultiplier: bonuses.stealth,
    gateCooldownMultiplier: 1 / bonuses.gates,
  };
}

export function getLegacySystemsDashboard(now = Date.now()) {
  return {
    scheduler: getLegacySchedulerPlan(now),
    ports: calculateLegacyPortManifest(1),
    banking: LEGACY_PHP_GAME_CONFIG.economy.banking,
    devices: deviceConfig,
    rules: LEGACY_PHP_GAME_CONFIG.rules,
    production: LEGACY_PHP_GAME_CONFIG.production,
    facilities: LEGACY_PHP_GAME_CONFIG.facilities,
    presentation: LEGACY_PHP_GAME_CONFIG.presentation,
    localization: LEGACY_PHP_GAME_CONFIG.localization,
    serverAccess: getLegacyServerAccess(),
    admin: getLegacyAdminPublicInfo(),
    integrations: getLegacyIntegrationInfo(),
  };
}
