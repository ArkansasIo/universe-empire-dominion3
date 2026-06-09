
import { type Express, type Request, type Response } from "express";
import { gameEngine } from "./gameEngine";
import {
  calculateLegacyMarketPrice,
  calculateLegacyPlanetProduction,
  calculateLegacyPortProduction,
  getLegacyPublicGameConfig,
  getLegacyRace,
  getLegacyRaceSystemBonus,
  type LegacyResourceKey,
} from "@shared/config";

export function registerGameRoutes(app: Express) {
  app.get("/api/game/config", (_req: Request, res: Response) => {
    res.json(getLegacyPublicGameConfig());
  });

  app.get("/api/game/config/races/:raceCode", (req: Request, res: Response) => {
    const raceCode = String(req.params.raceCode || "");
    res.json({
      race: getLegacyRace(raceCode),
      bonuses: getLegacyRaceSystemBonus(raceCode),
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
