
import { type Express, type Request, type Response } from "express";
import { gameEngine } from "./gameEngine";
import {
  calculateLegacyBankTick,
  calculateLegacyBounty,
  calculateLegacyMarketPrice,
  calculateLegacyPlanetProduction,
  calculateLegacyPlanetProductionDetail,
  calculateLegacyPortManifest,
  calculateLegacyPortProduction,
  calculateLegacyRealspaceTurnCost,
  calculateLegacyTechEffect,
  calculateLegacyTransferFee,
  calculateLegacyUpgradeCost,
  getLegacyPublicGameConfig,
  getLegacyRace,
  getLegacyRaceOperationsProfile,
  getLegacyRaceSystemBonus,
  getLegacySchedulerPlan,
  getLegacySystemsDashboard,
  purchaseLegacyDevice,
  shouldRegenerateNewbieShip,
  type LegacyResourceKey,
} from "@shared/config";

export function registerGameRoutes(app: Express) {
  app.get("/api/game/config", (_req: Request, res: Response) => {
    res.json(getLegacyPublicGameConfig());
  });

  app.get("/api/game/config/systems", (_req: Request, res: Response) => {
    res.json(getLegacySystemsDashboard());
  });

  app.get("/api/game/config/scheduler", (req: Request, res: Response) => {
    const now = Number(req.query.now || Date.now());
    res.json(getLegacySchedulerPlan(now));
  });

  app.get("/api/game/config/races/:raceCode", (req: Request, res: Response) => {
    const raceCode = String(req.params.raceCode || "");
    res.json({
      race: getLegacyRace(raceCode),
      bonuses: getLegacyRaceSystemBonus(raceCode),
      operations: getLegacyRaceOperationsProfile(raceCode),
    });
  });

  app.get("/api/game/config/economy/:resource", (req: Request, res: Response) => {
    const resource = String(req.params.resource || "") as LegacyResourceKey;
    if (!["ore", "organics", "goods", "energy"].includes(resource)) {
      return res.status(400).json({ message: "Invalid legacy resource" });
    }

    const ticks = Math.max(1, Number(req.query.ticks || 1));
    const productionPercent = Math.max(0, Number(req.query.productionPercent || 100));
    res.json({
      resource,
      prices: {
        min: calculateLegacyMarketPrice(resource, "min"),
        base: calculateLegacyMarketPrice(resource, "base"),
        max: calculateLegacyMarketPrice(resource, "max"),
      },
      production: {
        port: calculateLegacyPortProduction(resource, ticks),
        planet: calculateLegacyPlanetProduction(resource, productionPercent, ticks),
      },
    });
  });

  app.get("/api/game/config/ports/manifest", (req: Request, res: Response) => {
    const ticks = Math.max(1, Number(req.query.ticks || 1));
    res.json(calculateLegacyPortManifest(ticks));
  });

  app.post("/api/game/config/planets/production", (req: Request, res: Response) => {
    res.json(calculateLegacyPlanetProductionDetail(req.body || {}));
  });

  app.post("/api/game/config/banking/tick", (req: Request, res: Response) => {
    res.json(calculateLegacyBankTick(req.body || {}));
  });

  app.get("/api/game/config/banking/transfer-fee", (req: Request, res: Response) => {
    res.json({ fee: calculateLegacyTransferFee(Number(req.query.amount || 0)) });
  });

  app.get("/api/game/config/upgrades/cost", (req: Request, res: Response) => {
    const currentLevel = Number(req.query.currentLevel || 0);
    const targetLevel = Number(req.query.targetLevel || 0);
    res.json({ cost: calculateLegacyUpgradeCost(currentLevel, targetLevel) });
  });

  app.get("/api/game/config/tech/effect", (req: Request, res: Response) => {
    const baseValue = Number(req.query.baseValue || 1);
    const level = Number(req.query.level || 0);
    res.json({ value: calculateLegacyTechEffect(baseValue, level) });
  });

  app.post("/api/game/config/devices/purchase", (req: Request, res: Response) => {
    const { device, credits, inventory, quantity } = req.body || {};
    if (!["genesis", "emergencyWarp", "beacons", "warpEditors"].includes(String(device))) {
      return res.status(400).json({ message: "Invalid legacy device" });
    }
    res.json(purchaseLegacyDevice(device, Number(credits || 0), inventory || {}, Number(quantity || 1)));
  });

  app.post("/api/game/config/newbie-regeneration", (req: Request, res: Response) => {
    const { profile, destroyedWithoutEmergencyWarp } = req.body || {};
    res.json({ regenerate: shouldRegenerateNewbieShip(profile || {}, Boolean(destroyedWithoutEmergencyWarp)) });
  });

  app.post("/api/game/config/bounty", (req: Request, res: Response) => {
    res.json(calculateLegacyBounty(req.body || {}));
  });

  app.get("/api/game/config/travel/realspace-cost", (req: Request, res: Response) => {
    const distance = Number(req.query.distance || 0);
    const engineLevel = Number(req.query.engineLevel || 0);
    res.json({ turns: calculateLegacyRealspaceTurnCost(distance, engineLevel) });
  });

  app.get("/api/game/resources", (req: Request, res: Response) => {
    res.json(gameEngine.getResources());
  });

  app.get("/api/game/fleet", (req: Request, res: Response) => {
    res.json(gameEngine.getFleet());
  });

  app.get("/api/game/technology", (req: Request, res: Response) => {
    res.json(gameEngine.getTechnologyTree());
  });
}
