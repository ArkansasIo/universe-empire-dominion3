/**
 * Routes for features that had no backend handlers, causing 404s:
 *   /api/raids
 *   /api/raid-finder/*
 *   /api/relics + /api/relics/inventory
 *   /api/events
 *   /api/expeditions
 *   /api/exploration/*
 *   /api/missions/:id
 */

import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

// ─── helpers ─────────────────────────────────────────────────────────────────

function uid(userId: string) {
  return (req: Request) => (req.session as any)?.userId ?? userId;
}

function getUserId(req: Request): string {
  return (req.session as any)?.userId as string;
}

// ─── static catalog seed data ────────────────────────────────────────────────

const SAMPLE_RELICS = [
  { id: "relic-1", name: "Void Crystal", description: "A shard of crystallised dark matter from the edge of the universe.", rarity: "epic", bonuses: { researchSpeed: 10 }, effects: ["Unlocks Dark Matter research"], lore: "Found only at the collapse of ancient stars." },
  { id: "relic-2", name: "Ancient Core", description: "The pulsing core of an extinct war machine.", rarity: "legendary", bonuses: { fleetAttack: 15 }, effects: ["Fleet attack +15%"], lore: "Looted from the ruins of Fortress Zynara." },
  { id: "relic-3", name: "Stellar Shard", description: "A fragment of a neutron star.", rarity: "rare", bonuses: { energyOutput: 8 }, effects: ["Energy production +8%"], lore: "Thrums with residual pulsar energy." },
  { id: "relic-4", name: "Titan Rune", description: "Inscribed by the Titan builders in an age before memory.", rarity: "mythic", bonuses: { allStats: 5 }, effects: ["All stats +5%", "Unlocks Titan Codex"], lore: "Its glyphs shift when no one is watching." },
  { id: "relic-5", name: "Ore Compass", description: "Always points to the richest mineral vein nearby.", rarity: "common", bonuses: { miningYield: 5 }, effects: ["Mining yield +5%"], lore: "Standard issue for frontier prospectors." },
];

type RaidRole = "tank" | "dps" | "healer" | "support";

type SampleRaidParticipant = {
  playerId: string;
  role: RaidRole;
  joinedAt: string;
};

type SampleRaidRecord = {
  id: string;
  attackingTeamName: string;
  defendingTeamName: string;
  raidType: "guild_war" | "pvp_team" | "boss_raid" | "stronghold_attack";
  status: "preparing" | "active" | "completed";
  attackerLosses: { units: number };
  defenderLosses: { units: number };
  result: "attacker_victory" | "defender_victory" | "tie" | null;
  startedAt: string;
  completedAt?: string;
  minimumCommanders: number;
  maxCommanders: number;
  powerRequirement: number;
  rewards: { credits: number; metal: number; crystal: number };
  participants: SampleRaidParticipant[];
};

const raidState: SampleRaidRecord[] = [
  {
    id: "raid-1",
    attackingTeamName: "Iron Vanguard",
    defendingTeamName: "Nebula Hold",
    raidType: "guild_war",
    status: "active",
    attackerLosses: { units: 120 },
    defenderLosses: { units: 89 },
    result: null,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    minimumCommanders: 3,
    maxCommanders: 6,
    powerRequirement: 2200,
    rewards: { credits: 1400, metal: 5000, crystal: 2200 },
    participants: [
      { playerId: "iron-lead", role: "tank", joinedAt: new Date(Date.now() - 5400000).toISOString() },
      { playerId: "iron-wing", role: "dps", joinedAt: new Date(Date.now() - 5100000).toISOString() },
      { playerId: "iron-med", role: "healer", joinedAt: new Date(Date.now() - 5000000).toISOString() },
    ],
  },
  {
    id: "raid-2",
    attackingTeamName: "Dark Rift",
    defendingTeamName: "Starfall Base",
    raidType: "stronghold_attack",
    status: "completed",
    attackerLosses: { units: 45 },
    defenderLosses: { units: 210 },
    result: "attacker_victory",
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 82800000).toISOString(),
    minimumCommanders: 4,
    maxCommanders: 8,
    powerRequirement: 3400,
    rewards: { credits: 3000, metal: 12000, crystal: 5000 },
    participants: [
      { playerId: "dark-lead", role: "tank", joinedAt: new Date(Date.now() - 90000000).toISOString() },
      { playerId: "dark-ace", role: "dps", joinedAt: new Date(Date.now() - 89900000).toISOString() },
      { playerId: "dark-spark", role: "support", joinedAt: new Date(Date.now() - 89800000).toISOString() },
      { playerId: "dark-heal", role: "healer", joinedAt: new Date(Date.now() - 89700000).toISOString() },
    ],
  },
  {
    id: "raid-3",
    attackingTeamName: "Alpha Squad",
    defendingTeamName: "Beta Crew",
    raidType: "pvp_team",
    status: "preparing",
    attackerLosses: { units: 0 },
    defenderLosses: { units: 0 },
    result: null,
    startedAt: new Date(Date.now() - 600000).toISOString(),
    minimumCommanders: 2,
    maxCommanders: 6,
    powerRequirement: 1600,
    rewards: { credits: 900, metal: 2200, crystal: 900 },
    participants: [],
  },
];

const SAMPLE_EVENTS = [
  { id: "evt-1", name: "Meteor Storm", description: "A dense cloud of asteroids is crossing the sector. Mining yields doubled.", eventClass: "rare", status: "active", participants: 142, rewards: { metal: 5000, crystal: 2000 }, endsAt: new Date(Date.now() + 7200000).toISOString() },
  { id: "evt-2", name: "Solar Flare Warning", description: "Intense solar activity. All energy production boosted by 30%.", eventClass: "common", status: "active", participants: 511, rewards: { energy: 10000 }, endsAt: new Date(Date.now() + 3600000).toISOString() },
  { id: "evt-3", name: "Warp Anomaly", description: "A rift in space-time has been detected. Exploration rewards tripled.", eventClass: "epic", status: "upcoming", participants: 0, rewards: { xp: 500, crystal: 10000 }, startsAt: new Date(Date.now() + 1800000).toISOString() },
  { id: "evt-4", name: "Ancient Titan Resurgence", description: "Titan constructs have been reactivated deep in sector 9. All commanders get +25% XP.", eventClass: "legendary", status: "completed", participants: 892, rewards: {}, endsAt: new Date(Date.now() - 3600000).toISOString() },
];

// ─── Raids ────────────────────────────────────────────────────────────────────

export function registerMissingRoutes(app: Express) {
  // GET /api/raids  – list of current and recent raids
  app.get("/api/raids", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    res.json(
      raidState.map((raid) => {
        const joinedPlayers = raid.participants.length;
        const joined = raid.participants.some((participant) => participant.playerId === userId);
        return {
          ...raid,
          joined,
          joinedPlayers,
          canLaunch: raid.status === "preparing" && joinedPlayers >= raid.minimumCommanders,
        };
      })
    );
  });

  // ─── Raid Finder ──────────────────────────────────────────────────────────

  app.post("/api/raids/:raidId/join", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);
    const role = (String(req.body?.role || "dps").trim().toLowerCase() || "dps") as RaidRole;

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "preparing") {
      return res.status(400).json({ error: "Only preparing raids can accept new commanders" });
    }
    if (!["tank", "dps", "healer", "support"].includes(role)) {
      return res.status(400).json({ error: "Invalid raid role" });
    }

    const existing = raid.participants.find((participant) => participant.playerId === userId);
    if (existing) {
      existing.role = role;
      return res.json({ success: true, raid, joined: true, updatedRole: true });
    }

    if (raid.participants.length >= raid.maxCommanders) {
      return res.status(400).json({ error: "Raid roster is full" });
    }

    raid.participants.push({
      playerId: userId,
      role,
      joinedAt: new Date().toISOString(),
    });

    res.json({ success: true, raid, joined: true });
  });

  app.post("/api/raids/:raidId/leave", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "preparing") {
      return res.status(400).json({ error: "Only preparing raids can remove commanders" });
    }

    raid.participants = raid.participants.filter((participant) => participant.playerId !== userId);
    res.json({ success: true, raid, joined: false });
  });

  app.post("/api/raids/:raidId/launch", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "preparing") {
      return res.status(400).json({ error: "Raid is not in preparation" });
    }
    if (!raid.participants.some((participant) => participant.playerId === userId)) {
      return res.status(403).json({ error: "Join the raid before launching it" });
    }
    if (raid.participants.length < raid.minimumCommanders) {
      return res.status(400).json({ error: "Not enough commanders to launch this raid" });
    }

    raid.status = "active";
    raid.startedAt = new Date().toISOString();
    raid.result = null;

    res.json({ success: true, raid, message: "Raid launched successfully" });
  });

  app.post("/api/raids/:raidId/resolve", isAuthenticated, (req: Request, res: Response) => {
    const raid = raidState.find((entry) => entry.id === req.params.raidId);

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "active") {
      return res.status(400).json({ error: "Only active raids can be resolved" });
    }

    const roleCount = new Set(raid.participants.map((participant) => participant.role)).size;
    const cohesionScore = raid.participants.length + roleCount;
    const attackerVictory = cohesionScore >= raid.minimumCommanders + 2;

    raid.status = "completed";
    raid.result = attackerVictory ? "attacker_victory" : "defender_victory";
    raid.completedAt = new Date().toISOString();
    raid.attackerLosses = { units: Math.max(12, 22 * raid.participants.length - roleCount * 5) };
    raid.defenderLosses = {
      units: attackerVictory
        ? Math.max(30, 44 * raid.participants.length + roleCount * 8)
        : Math.max(18, 16 * raid.participants.length),
    };

    if (!attackerVictory) {
      raid.rewards = {
        credits: Math.floor(raid.rewards.credits * 0.4),
        metal: Math.floor(raid.rewards.metal * 0.35),
        crystal: Math.floor(raid.rewards.crystal * 0.35),
      };
    }

    res.json({
      success: true,
      raid,
      message: attackerVictory ? "Raid resolved in the attackers' favor" : "Defenders held the line",
    });
  });

  const raidFinderQueue: any[] = [];

  app.get("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    // Return current queue with player counts per role
    const userId = getUserId(req);
    const roles = ["tank", "dps", "healer", "support"];
    const summary = roles.map(role => ({
      role,
      queued: raidFinderQueue.filter(e => e.preferredRole === role).length,
      avgWait: Math.floor(Math.random() * 5) + 1,
    }));
    const myEntry = raidFinderQueue.find((entry) => entry.userId === userId) || null;
    const position = myEntry ? raidFinderQueue.findIndex((entry) => entry.userId === userId) + 1 : null;
    res.json({
      queue: raidFinderQueue,
      roleSummary: summary,
      queued: Boolean(myEntry),
      position,
      myEntry,
    });
  });

  app.post("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { preferredRole = "dps" } = req.body as { preferredRole?: string };
    const existing = raidFinderQueue.findIndex(e => e.userId === userId);
    if (existing >= 0) {
      raidFinderQueue[existing].preferredRole = preferredRole;
      return res.json({ queued: true, position: existing + 1, preferredRole });
    }
    raidFinderQueue.push({ userId, preferredRole, joinedAt: new Date().toISOString() });
    res.json({ queued: true, position: raidFinderQueue.length, preferredRole });
  });

  app.delete("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const idx = raidFinderQueue.findIndex(e => e.userId === userId);
    if (idx >= 0) raidFinderQueue.splice(idx, 1);
    res.json({ queued: false });
  });

  // ─── Relics ───────────────────────────────────────────────────────────────

  app.get("/api/relics", isAuthenticated, (_req: Request, res: Response) => {
    res.json(SAMPLE_RELICS);
  });

  app.get("/api/relics/inventory", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const relicsOwned: any[] = (playerState as any)?.relicsInventory || [];
      if (relicsOwned.length === 0) {
        // Seed a starting relic so the inventory is not empty
        const starter = { id: `owned-${userId}-1`, relicId: "relic-3", name: "Stellar Shard", condition: 90, isEquipped: false, acquiredAt: new Date().toISOString() };
        return res.json([starter]);
      }
      res.json(relicsOwned);
    } catch {
      res.json([]);
    }
  });

  // ─── Universe Events ──────────────────────────────────────────────────────

  app.get("/api/events", isAuthenticated, (_req: Request, res: Response) => {
    res.json(SAMPLE_EVENTS);
  });

  // ─── Expeditions ─────────────────────────────────────────────────────────

  app.get("/api/expeditions", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const expeditions: any[] = (playerState as any)?.expeditions || [];
      res.json({ expeditions, count: expeditions.length });
    } catch {
      res.json({ expeditions: [], count: 0 });
    }
  });

  app.post("/api/expeditions", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const {
      name,
      type = "exploration",
      subType,
      categoryId,
      subCategoryId,
      tier = 1,
      level = 1,
      rank,
      title,
      targetCoordinates = "0:0:0",
      fleetComposition = {},
      troopComposition = {},
    } = req.body as {
      name?: string;
      type?: string;
      subType?: string;
      categoryId?: string;
      subCategoryId?: string;
      tier?: number;
      level?: number;
      rank?: string;
      title?: string;
      targetCoordinates?: string;
      fleetComposition?: Record<string, number>;
      troopComposition?: Record<string, number>;
    };
    if (!name) return res.status(400).json({ error: "Expedition name is required" });
    const tierNum = Number(tier);
    const levelNum = Number(level);
    if (!Number.isInteger(tierNum) || tierNum < 1 || tierNum > 99) {
      return res.status(400).json({ error: "tier must be an integer between 1 and 99" });
    }
    if (!Number.isInteger(levelNum) || levelNum < 1 || levelNum > 999) {
      return res.status(400).json({ error: "level must be an integer between 1 and 999" });
    }
    try {
      const playerState = await storage.getPlayerState(userId);
      const expeditions: any[] = (playerState as any)?.expeditions || [];
      const newExp = {
        id: `exp-${Date.now()}`,
        name,
        type,
        subType: subType ?? null,
        categoryId: categoryId ?? null,
        subCategoryId: subCategoryId ?? null,
        tier: tierNum,
        level: levelNum,
        rank: rank ?? null,
        title: title ?? null,
        targetCoordinates,
        status: "preparing",
        fleetComposition,
        troopComposition,
        discoveries: [],
        casualties: {},
        resources: {},
        startedAt: new Date().toISOString(),
      };
      expeditions.push(newExp);
      await storage.updatePlayerState(userId, { expeditions } as any);
      res.status(201).json(newExp);
    } catch (err) {
      res.status(500).json({ error: "Failed to create expedition" });
    }
  });

  // ─── Exploration ──────────────────────────────────────────────────────────

  app.get("/api/exploration/state", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const explorationState = (playerState as any)?.explorationState || { claimedQuestIds: [], harvestedDebrisIds: [] };
      res.json(explorationState);
    } catch {
      res.json({ claimedQuestIds: [], harvestedDebrisIds: [] });
    }
  });

  app.post("/api/exploration/scan", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { anomalyId, anomalyName, hazardLevel = 1, rewards } = req.body as {
      anomalyId: string;
      anomalyName: string;
      hazardLevel?: number;
      rewards?: { metal?: number; crystal?: number; deuterium?: number };
    };
    if (!anomalyId) return res.status(400).json({ error: "anomalyId is required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ error: "Player state not found" });

      const baseReward = rewards || {};
      const multiplier = Math.max(1, hazardLevel);
      const gained = {
        metal:    Math.floor((baseReward.metal    || 200) * multiplier),
        crystal:  Math.floor((baseReward.crystal  || 100) * multiplier),
        deuterium:Math.floor((baseReward.deuterium || 50) * multiplier),
      };

      const current = playerState as any;
      await storage.updatePlayerState(userId, {
        metal:     (Number(current.metal)     || 0) + gained.metal,
        crystal:   (Number(current.crystal)   || 0) + gained.crystal,
        deuterium: (Number(current.deuterium) || 0) + gained.deuterium,
      } as any);

      res.json({ success: true, anomalyId, anomalyName, gained });
    } catch (err) {
      res.status(500).json({ error: "Failed to process scan" });
    }
  });

  app.post("/api/exploration/warp-action", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { gateId, gateName, action, energyCost = 0 } = req.body as {
      gateId: string;
      gateName: string;
      action: "jump" | "capture";
      energyCost?: number;
    };
    if (!gateId || !action) return res.status(400).json({ error: "gateId and action are required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      const current = playerState as any;
      if (energyCost > 0) {
        const newEnergy = Math.max(0, (Number(current.energy) || 0) - energyCost);
        await storage.updatePlayerState(userId, { energy: newEnergy } as any);
      }

      res.json({ success: true, gateId, gateName, action, message: action === "jump" ? "Warp jump completed" : "Gate captured" });
    } catch {
      res.status(500).json({ error: "Failed to process warp action" });
    }
  });

  app.post("/api/exploration/quest-claim", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { questId, rewards } = req.body as {
      questId: string;
      rewards?: { metal?: number; crystal?: number; deuterium?: number; xp?: number };
    };
    if (!questId) return res.status(400).json({ error: "questId is required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const current = playerState as any;
      const explState = current.explorationState || { claimedQuestIds: [], harvestedDebrisIds: [] };

      if (explState.claimedQuestIds.includes(questId)) {
        return res.status(409).json({ error: "Quest already claimed" });
      }

      const gain = {
        metal:    rewards?.metal    || 300,
        crystal:  rewards?.crystal  || 150,
        deuterium:rewards?.deuterium|| 75,
        xp:       rewards?.xp      || 50,
      };

      explState.claimedQuestIds.push(questId);

      await storage.updatePlayerState(userId, {
        metal:     (Number(current.metal)     || 0) + gain.metal,
        crystal:   (Number(current.crystal)   || 0) + gain.crystal,
        deuterium: (Number(current.deuterium) || 0) + gain.deuterium,
        explorationState: explState,
      } as any);

      res.json({ success: true, questId, gain });
    } catch {
      res.status(500).json({ error: "Failed to claim quest reward" });
    }
  });

  app.post("/api/exploration/debris-harvest", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { debrisId, debrisName, resources, harvestProgress = 100 } = req.body as {
      debrisId: string;
      debrisName: string;
      resources?: { metal?: number; crystal?: number; deuterium?: number };
      harvestProgress?: number;
    };
    if (!debrisId) return res.status(400).json({ error: "debrisId is required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const current = playerState as any;
      const explState = current.explorationState || { claimedQuestIds: [], harvestedDebrisIds: [] };

      if (explState.harvestedDebrisIds.includes(debrisId)) {
        return res.status(409).json({ error: "Debris already harvested" });
      }

      const ratio = Math.min(1, harvestProgress / 100);
      const gain = {
        metal:    Math.floor((resources?.metal    || 500) * ratio),
        crystal:  Math.floor((resources?.crystal  || 200) * ratio),
        deuterium:Math.floor((resources?.deuterium|| 100) * ratio),
      };

      explState.harvestedDebrisIds.push(debrisId);

      await storage.updatePlayerState(userId, {
        metal:     (Number(current.metal)     || 0) + gain.metal,
        crystal:   (Number(current.crystal)   || 0) + gain.crystal,
        deuterium: (Number(current.deuterium) || 0) + gain.deuterium,
        explorationState: explState,
      } as any);

      res.json({ success: true, debrisId, debrisName, gain });
    } catch {
      res.status(500).json({ error: "Failed to harvest debris" });
    }
  });

  // ─── Missions ─────────────────────────────────────────────────────────────

  app.get("/api/missions/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params;
    try {
      const playerState = await storage.getPlayerState(userId);
      const travelState = (playerState as any)?.travelState || {};
      const activeMissions: any[] = travelState.activeMissions || [];
      const mission = activeMissions.find((m: any) => m.id === id);
      if (!mission) return res.status(404).json({ error: "Mission not found" });
      res.json(mission);
    } catch {
      res.status(500).json({ error: "Failed to load mission" });
    }
  });
}
