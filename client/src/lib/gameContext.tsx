import React, { createContext, useContext, useState, useEffect } from 'react';
import { Research } from './researchData'; // Keep this import if we need the interface, but we redefine state here

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

interface Buildings {
  metalMine: number;
  crystalMine: number;
  deuteriumSynthesizer: number;
  solarPlant: number;
  roboticsFactory: number;
  shipyard: number;
  researchLab: number;
}

// Dynamic unit storage
type Units = {
  [key: string]: number;
};

interface GameState {
  resources: Resources;
  buildings: Buildings;
  research: {[key: string]: number};
  units: Units; // Replaces 'ships' with generic units
  planetName: string;
  updateBuilding: (building: keyof Buildings) => void;
  updateResearch: (tech: string) => void;
  buildUnit: (unitId: string, amount: number) => void; // Replaces buildShip
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resources>({
    metal: 50000,
    crystal: 50000,
    deuterium: 20000,
    energy: 5000,
  });

  const [buildings, setBuildings] = useState<Buildings>({
    metalMine: 10,
    crystalMine: 8,
    deuteriumSynthesizer: 5,
    solarPlant: 12,
    roboticsFactory: 2,
    shipyard: 2,
    researchLab: 1,
  });

  const [research, setResearch] = useState<{[key: string]: number}>({
    energyTech: 0,
    laserTech: 0,
    ionTech: 0,
    hyperspaceTech: 0,
    plasmaTech: 0,
    combustionDrive: 0,
    impulseDrive: 0,
    hyperspaceDrive: 0,
    espionageTech: 0,
    computerTech: 0,
    astrophysics: 0,
    intergalacticResearchNetwork: 0,
    gravitonTech: 0,
    weaponsTech: 0,
    shieldingTech: 0,
    armourTech: 0,
    aiTech: 0,
    quantumTech: 0
  });

  const [units, setUnits] = useState<Units>({
    lightFighter: 5,
    smallCargo: 2,
    espionageProbe: 10,
    marine: 50,
    colonist: 100
  });

  const planetName = "Homeworld";

  // Calculate production
  const getProduction = () => {
    const metalProd = 30 * buildings.metalMine * Math.pow(1.1, buildings.metalMine);
    const crystalProd = 20 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine);
    const deutProd = 10 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer);
    const energyProd = 20 * buildings.solarPlant * Math.pow(1.1, buildings.solarPlant);
    
    const metalCons = 10 * buildings.metalMine * Math.pow(1.1, buildings.metalMine);
    const crystalCons = 10 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine);
    const deutCons = 20 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer);
    
    const energyUsed = metalCons + crystalCons + deutCons;

    return {
      metal: metalProd / 3600,
      crystal: crystalProd / 3600,
      deuterium: deutProd / 3600,
      energy: energyProd - energyUsed
    };
  };

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const production = getProduction();
      
      setResources(prev => ({
        metal: prev.metal + (production.metal * 10),
        crystal: prev.crystal + (production.crystal * 10),
        deuterium: prev.deuterium + (production.deuterium * 10),
        energy: production.energy
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [buildings]);

  const updateBuilding = (building: keyof Buildings) => {
    const costMetal = 100 * Math.pow(2, buildings[building]);
    const costCrystal = 50 * Math.pow(2, buildings[building]);

    if (resources.metal >= costMetal && resources.crystal >= costCrystal) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - costMetal,
        crystal: prev.crystal - costCrystal
      }));
      setBuildings(prev => ({
        ...prev,
        [building]: prev[building] + 1
      }));
    } else {
      alert("Not enough resources!");
    }
  };

  const updateResearch = (tech: string) => {
     setResearch(prev => ({
       ...prev,
       [tech]: (prev[tech] || 0) + 1
     }));
  };

  // Replaces buildShip, works for all units
  const buildUnit = (unitId: string, amount: number) => {
    // In a real app, we'd import unitData here to check costs
    // For now, we mock the deduction or rely on the UI to have checked it
    // We'll assume the UI call is valid for this prototype
    setUnits(prev => ({
      ...prev,
      [unitId]: (prev[unitId] || 0) + amount
    }));
    
    // Mock resource deduction (simplified, ideally strictly checked)
    // Not implementing specific cost deduction here without importing unitData to avoid circular deps in this simple setup
    // In a real app, GameContext would import a pure data file.
  };

  return (
    <GameContext.Provider value={{ 
       resources, 
       buildings, 
       research,
       units,
       planetName, 
       updateBuilding,
       updateResearch,
       buildUnit
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
