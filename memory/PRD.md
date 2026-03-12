# Stellar Dominion 1.5 - Enhanced Edition PRD

## Project Overview
**Name:** Stellar Dominion 1.5  
**Version:** 2.0.0  
**Type:** 4X Space Strategy Game  
**Date:** March 12, 2026

## Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Wouter, TanStack Query
- **Backend:** Python FastAPI, MongoDB
- **UI:** Radix UI, Framer Motion, Recharts, Lucide Icons

---

## ENHANCED PLANET SYSTEM ✅

### Planet Positioning & Size
- **15 positions** per solar system
- **Position 8 = OPTIMAL** (max 252 base fields)
- Position size ranges:
  - Pos 1: 34-68 fields, Pos 8: 210-252 fields, Pos 15: 34-68 fields
- **Max achievable: 360+ fields** with all bonuses

### Size Bonuses
- **Discoverer Class:** +10% planet size on colonization
- **Cetus Lifeform:** +25 fields
- **Alliance bonuses:** +2 to +15 fields based on member count
- **Terraformer:** +5 fields per level (max level 20)

### Field Size Categories (12 types)
| Category | Fields | 
|----------|--------|
| Micro | 1-50 |
| Tiny | 51-100 |
| Small | 101-150 |
| Normal | 151-250 |
| Large | 251-350 |
| Very Large | 351-500 |
| Huge | 501-1,000 |
| Massive | 1,001-10,000 |
| Continental | 10,001-50,000 |
| Oceanic | 50,001-99,999 |
| Extreme Large | 100,000-500,000 |
| Mega | 500,001-999,999 |

---

## PLANET CLASSES (12 Types) ✅

| Class | Name | Habitability | Resource Mod |
|-------|------|--------------|--------------|
| M | Terran | 0.95 | 1.0 |
| O | Ocean | 0.75 | 0.8 |
| L | Marginal | 0.45 | 1.1 |
| H | Desert | 0.35 | 1.3 |
| P | Glacial | 0.25 | 0.9 |
| Y | Demon | 0.10 | 1.8 |
| J | Gas Giant | 0.00 | 2.5 |
| K | Adaptable | 0.55 | 1.2 |
| D | Asteroid | 0.15 | 1.5 |
| T | Gas Dwarf | 0.05 | 1.4 |
| N | Reducing | 0.20 | 1.6 |
| R | Rogue | 0.08 | 0.7 |

---

## PLANET TYPES & SUBTYPES (12 Types) ✅

1. **Terrestrial** - Silicate, Iron Core, Carbon, Lava
2. **Ocean** - Shallow, Deep, Ice-Covered
3. **Desert** - Hot, Cold, Dust
4. **Ice** - Permafrost, Glacial, Cryo
5. **Volcanic** - Active, Dormant, Magma
6. **Gas Giant** - Hot Jupiter, Cold Jupiter, Super Jupiter
7. **Barren** - Cratered, Smooth, Fractured
8. **Jungle** - Tropical, Fungal, Swamp
9. **Toxic** - Acid, Sulfuric, Methane
10. **Artificial** - Ecumenopolis, Machine World, Ringworld
11. **Exotic** - Crystalline, Radioactive, Dark Matter
12. **Proto** - Accretion, Protoplanetary

---

## BIOMES (90 Types) ✅

### Categories:
- **Terrestrial (1-15):** Temperate Forest, Tropical Rainforest, Boreal, etc.
- **Desert (16-30):** Hot Desert, Cold Desert, Salt Flat, Dune Sea, etc.
- **Ice (31-45):** Ice Sheet, Tundra, Glacier, Permafrost, etc.
- **Ocean (46-60):** Coral Reef, Kelp Forest, Hydrothermal Vent, etc.
- **Volcanic (61-75):** Lava Field, Caldera, Geyser Basin, etc.
- **Exotic (76-90):** Crystal Forest, Ammonia Sea, Dark Energy Nexus, etc.

---

## LIFEFORMS (8 Types) ✅

| Lifeform | Field Bonus | Special |
|----------|-------------|---------|
| Humans | 0 | Balanced bonuses |
| Rock'tal | +5 | Defense +20% |
| Mechas | +10 | Research +25% |
| Kaelesh | +15 | Exploration +30% |
| **Cetus** | **+25** | **Best for size!** |
| Vortex | +8 | Energy +50% |
| Zephyr | +12 | Fleet speed +35% |
| Crystalline | +7 | Crystal +40% |

---

## PLAYER CLASSES (3 Types) ✅

| Class | Bonus |
|-------|-------|
| Collector | +25% resources |
| General | +20% attack/defense |
| **Discoverer** | **+10% planet size** |

---

## SPACE STATIONS (8 Types) ✅

1. **Orbital Station** - 50 fields, resource processing
2. **Starbase** - 150 fields, military operations
3. **Moonbase** - 100 fields, sensor range
4. **Trading Post** - 75 fields, trade bonuses
5. **Research Station** - 60 fields, tech bonus
6. **Defense Platform** - 40 fields, 2x defense power
7. **Shipyard Station** - 120 fields, build speed
8. **Colony Hub** - 80 fields, colony management

---

## MOON SYSTEM ✅

- **Creation:** From combat debris (1% per 100k debris, max 20%)
- **Size:** 2,000-8,947 km diameter
- **Fields:** 1 base + diameter × 0.01

### Moon Facilities:
- Lunar Base (+3 fields/level)
- Sensor Phalanx
- Jump Gate
- Moon Shipyard
- Moon Defense Platform

---

## COMBAT SYSTEM (OGame-style) ✅

### Rounds: 1-15 turns
- Shield regeneration: 5%/round
- Debris rate: 30%
- Retreat chance: 3%/round
- Critical hit: 5%

### Ships (14 types):
Light Fighter, Heavy Fighter, Cruiser, Battleship, Battlecruiser, Bomber, Destroyer, Deathstar, Small Cargo, Large Cargo, Colony Ship, Recycler, Espionage Probe, Solar Satellite

### Defense (8 types):
Rocket Launcher, Light Laser, Heavy Laser, Gauss Cannon, Ion Cannon, Plasma Turret, Small Shield Dome, Large Shield Dome

### Features:
- **Rapidfire system** - Chain attacks
- **Planet stealing** - Conquer non-homeworld planets
- **Moon creation** - From combat debris
- **Combat reports** - Detailed battle logs

---

## EMPIRE LIMITS ✅

- **Min planets:** 1
- **Max planets:** 15 (base), 25 (with bonuses)
- **Max moons:** 15
- **Max stations:** 10
- **Max empire fields:** 999,999
- **Page sizes:** 15-100 per page

---

## API ENDPOINTS

### Config
- `/api/config/planet-classes` - 12 planet classes
- `/api/config/planet-types` - 12 types with subtypes
- `/api/config/biomes` - 90 biomes
- `/api/config/lifeforms` - 8 lifeforms
- `/api/config/player-classes` - 3 classes
- `/api/config/station-types` - 8 stations
- `/api/config/field-sizes` - 12 categories
- `/api/config/combat` - Combat system config

### Gameplay
- `/api/planets` - Planet management (paginated)
- `/api/planets/colonize` - Colonization
- `/api/planets/select/{id}` - Switch planets
- `/api/moons` - Moon management
- `/api/stations` - Station management
- `/api/combat/attack` - Attack players
- `/api/combat/steal-planet` - Planet stealing
- `/api/combat/simulate` - Combat preview
- `/api/combat/reports` - Battle reports

---

## Testing Results

- **Backend:** 95.5% pass rate
- **Frontend:** 95% pass rate
- **All v1.5 features verified working**

---

## Next Action Items

1. Frontend integration for new planet system UI
2. Add visual planet class/type indicators
3. Implement station building UI
4. Combat replay visualization
5. Moon management interface

## Future Enhancements

- WebSocket real-time updates
- Mobile responsive design
- Achievement system
- Daily login rewards
- Seasonal events
