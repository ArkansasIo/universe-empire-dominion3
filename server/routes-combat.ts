import { Router } from "express";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";
import { simulateBattle, calculateVictoryResources } from "./combatEngine";
import { isAuthenticated as authenticateRequest } from "./basicAuth";
import type { Request, Response } from "express";

export function registerCombatRoutes(app: Router) {
  /**
   * GET /api/combat/stats
   * Get combat statistics for player (power level, units, research)
   */
  app.get("/api/combat/stats", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerState = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) {
        return res
          .status(404)
          .json({ error: "Player state not found" });
      }

      const state = playerState[0];
      const units = state.units as any || {};
      const research = state.research as any || {};
      const buildings = state.buildings as any || {};

      // Calculate total fleet power
      const UNIT_POWER = {
        lightFighter: 50,
        heavyFighter: 120,
        smallCargo: 30,
        largeCargo: 60,
        espionageProbe: 10,
        battleship: 300,
        cruiser: 200,
        destroyer: 150,
        dreadnought: 500,
        colonist: 5,
      } as any;

      let fleetPower = 0;
      for (const [unitType, count] of Object.entries(units)) {
        fleetPower += (UNIT_POWER[unitType] || 50) * (count as number);
      }

      // Calculate combat bonuses from research
      const weaponsBonus = (research.weaponsTech || 0) * 0.05; // 5% per level
      const shieldingBonus = (research.shieldingTech || 0) * 0.05;
      const armorBonus = (research.armourTech || 0) * 0.03;

      res.json({
        totalUnits: Object.values(units).reduce((a: number, b: any) => a + (b as number), 0),
        fleetPower: Math.floor(fleetPower * (1 + weaponsBonus)),
        unitComposition: units,
        research: {
          weaponsTech: research.weaponsTech || 0,
          shieldingTech: research.shieldingTech || 0,
          armourTech: research.armourTech || 0,
        },
        bonuses: {
          attack: weaponsBonus,
          defense: shieldingBonus,
          armor: armorBonus,
        },
        shipyard: buildings.shipyard || 0,
      });
    } catch (error) {
      console.error("[combat-stats] Error:", error);
      res.status(500).json({ error: "Failed to get combat stats" });
    }
  });

  /**
   * POST /api/combat/attack
   * Attack another player
   * Body: { targetId: string, units: { shipType: count, ... } }
   */
  app.post("/api/combat/attack", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetId, units: attackUnits } = req.body;
      if (!targetId || !attackUnits) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get attacker state
      const attackerResult = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!attackerResult.length) {
        return res.status(404).json({ error: "Attacker not found" });
      }

      // Get defender state
      const defenderResult = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, targetId))
        .limit(1);

      if (!defenderResult.length) {
        return res.status(404).json({ error: "Defender not found" });
      }

      const attacker = attackerResult[0];
      const defender = defenderResult[0];

      // Check attacker has units
      const attackerUnits = attacker.units as any || {};
      for (const [unitType, count] of Object.entries(attackUnits)) {
        if ((attackerUnits[unitType] || 0) < (count as number)) {
          return res
            .status(400)
            .json({
              error: `Insufficient units: need ${count} ${unitType}, have ${attackerUnits[unitType] || 0}`,
            });
        }
      }

      // Simulate battle
      const battleResult = simulateBattle(
        {
          units: Object.entries(attackUnits || {}).reduce((acc, [type, count]) => {
            acc[type] = { type, count: count as number };
            return acc;
          }, {} as any),
          research: attacker.research as any,
          bonusMultiplier: 1 + ((attacker.research as any)?.militaryTech || 0) * 0.02,
        },
        {
          units: Object.entries(defender.units || {}).reduce((acc, [type, count]) => {
            acc[type] = { type, count: count as number };
            return acc;
          }, {} as any),
          research: defender.research as any,
          bonusMultiplier: 1 + ((defender.research as any)?.defenseTech || 0) * 0.02,
        }
      );

      // Process results
      if (battleResult.winner === "attacker") {
        // Calculate plunder
        const defenderResources = defender.resources as any || {};
        const plunder = calculateVictoryResources(defenderResources, "attacker");

        // Update attacker units
        const newAttackerUnits = { ...attackerUnits };
        for (const casualty of Object.entries(battleResult.attackerUnits)) {
          newAttackerUnits[(casualty as any)[0]] -= ((casualty as any)[1].count || 0);
        }

        // Update attacker resources
        const newAttackerResources = {
          ...(attacker.resources as any),
          metal: ((attacker.resources as any)?.metal || 0) + plunder.metal,
          crystal: ((attacker.resources as any)?.crystal || 0) + plunder.crystal,
          deuterium:
            ((attacker.resources as any)?.deuterium || 0) + plunder.deuterium,
        };

        // Update defender resources
        const newDefenderResources = {
          ...(defender.resources as any),
          metal:
            ((defender.resources as any)?.metal || 0) - plunder.metal < 0
              ? 0
              : ((defender.resources as any)?.metal || 0) - plunder.metal,
          crystal:
            ((defender.resources as any)?.crystal || 0) - plunder.crystal < 0
              ? 0
              : ((defender.resources as any)?.crystal || 0) - plunder.crystal,
          deuterium:
            ((defender.resources as any)?.deuterium || 0) - plunder.deuterium < 0
              ? 0
              : ((defender.resources as any)?.deuterium || 0) - plunder.deuterium,
        };

        // Update database
        await db
          .update(playerStates)
          .set({
            units: newAttackerUnits,
            resources: newAttackerResources,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, userId));

        await db
          .update(playerStates)
          .set({
            resources: newDefenderResources,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, targetId));

        res.json({
          success: true,
          winner: "attacker",
          battleResult,
          plunder,
          newAttackerUnits,
          newAttackerResources,
        });
      } else {
        // Defender wins - attacker units destroyed
        const newAttackerUnits = { ...attackerUnits };
        for (const casualty of Object.entries(battleResult.attackerUnits)) {
          newAttackerUnits[(casualty as any)[0]] -= ((casualty as any)[1].count || 0);
        }

        // Update database
        await db
          .update(playerStates)
          .set({
            units: newAttackerUnits,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, userId));

        res.json({
          success: true,
          winner: "defender",
          battleResult,
          plunder: { metal: 0, crystal: 0, deuterium: 0 },
          newAttackerUnits,
        });
      }
    } catch (error) {
      console.error("[combat-attack] Error:", error);
      res.status(500).json({ error: "Failed to process combat" });
    }
  });

  /**
   * POST /api/combat/garrison
   * Assign units to defend a location
   * Body: { units: { shipType: count, ... } }
   */
  app.post("/api/combat/garrison", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { units } = req.body;
      if (!units) {
        return res.status(400).json({ error: "Missing units" });
      }

      const playerState = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) {
        return res.status(404).json({ error: "Player not found" });
      }

      const currentUnits = (playerState[0].units as any) || {};

      // Verify player has units
      for (const [unitType, count] of Object.entries(units)) {
        if ((currentUnits[unitType] || 0) < (count as number)) {
          return res
            .status(400)
            .json({
              error: `Insufficient ${unitType}: have ${currentUnits[unitType] || 0}, need ${count}`,
            });
        }
      }

      // Create garrison (stored in artifacts or custom field)
      const garrison = {
        type: "garrison",
        units,
        createdAt: new Date(),
      };

      res.json({
        success: true,
        garrison,
        message: "Garrison assigned successfully",
      });
    } catch (error) {
      console.error("[combat-garrison] Error:", error);
      res.status(500).json({ error: "Failed to garrison units" });
    }
  });

  /**
   * POST /api/combat/defense/activate
   * Activate planetary defenses
   * Body: { unitType: string, quantity: number }
   */
  app.post("/api/combat/defense/activate", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { unitType, quantity } = req.body;
      if (!unitType || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const playerState = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) {
        return res.status(404).json({ error: "Player not found" });
      }

      // Get buildings for defense bonus
      const buildings = (playerState[0].buildings as any) || {};
      const defenseBonus = (buildings.defenseGrid || 0) * 0.1; // +10% defense per level

      res.json({
        success: true,
        defense: {
          unitType,
          quantity,
          defenseBonus,
          effectiveDefense: quantity * (1 + defenseBonus),
        },
      });
    } catch (error) {
      console.error("[combat-defense] Error:", error);
      res.status(500).json({ error: "Failed to activate defenses" });
    }
  });

  /**
   * GET /api/combat/battle-history
   * Get recent battles for player
   */
  app.get("/api/combat/battle-history", authenticateRequest as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      // Return mock battle history (can be expanded to store in DB)
      const mockBattles = [
        {
          id: "battle_001",
          timestamp: new Date(Date.now() - 86400000),
          opponent: "Enemy Player 1",
          result: "victory",
          unitsCasualties: 15,
          plunder: { metal: 5000, crystal: 3000, deuterium: 1000 },
        },
        {
          id: "battle_002",
          timestamp: new Date(Date.now() - 172800000),
          opponent: "Enemy Player 2",
          result: "defeat",
          unitsCasualties: 42,
          plunder: { metal: 0, crystal: 0, deuterium: 0 },
        },
      ];

      res.json({
        battles: mockBattles,
        totalVictories: 1,
        totalDefeats: 1,
      });
    } catch (error) {
      console.error("[combat-history] Error:", error);
      res.status(500).json({ error: "Failed to get battle history" });
    }
  });
}
