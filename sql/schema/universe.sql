-- Universe Schema - Celestial objects and coordinates
-- This schema is deterministically generated based on coordinate hashing

CREATE TABLE IF NOT EXISTS galaxies (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  star_count INTEGER DEFAULT 500,
  discovery_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stars (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL REFERENCES galaxies(galaxy_id),
  star_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  star_type VARCHAR(50) NOT NULL, -- O, B, A, F, G, K, M, N, H
  star_class VARCHAR(10) NOT NULL, -- I, II, III, IV, V
  temperature INTEGER, -- Kelvin
  luminosity REAL,
  mass REAL, -- Solar masses
  radius REAL, -- Solar radii
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  planet_count INTEGER DEFAULT 8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_star_coords UNIQUE(galaxy_id, coordinate_x, coordinate_y, coordinate_z)
);

CREATE TABLE IF NOT EXISTS planets (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL,
  star_id INTEGER NOT NULL,
  planet_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  planet_type VARCHAR(50) NOT NULL, -- terrestrial, gas_giant, ice_giant, terrestrial_exotic, etc.
  planet_class VARCHAR(10) NOT NULL, -- 1-12 (OGame classification)
  diameter INTEGER, -- km
  mass REAL, -- Earth masses
  orbit_distance REAL, -- AU
  temperature INTEGER, -- Kelvin
  atmosphere VARCHAR(50),
  habitability_score REAL, -- 0.0 to 1.0
  resources JSONB DEFAULT '{"metal": 500, "crystal": 300, "deuterium": 100}'::jsonb,
  moon_count INTEGER DEFAULT 0,
  current_occupant_id VARCHAR(36), -- User ID if colonized
  colonized_at TIMESTAMP,
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_planet_coords UNIQUE(galaxy_id, coordinate_x, coordinate_y, coordinate_z),
  FOREIGN KEY (current_occupant_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS moons (
  id SERIAL PRIMARY KEY,
  planet_id INTEGER NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  moon_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  diameter INTEGER,
  mass REAL,
  orbit_distance REAL,
  temperature INTEGER,
  current_occupant_id VARCHAR(36),
  colonized_at TIMESTAMP,
  resources JSONB DEFAULT '{"metal": 200, "crystal": 100, "deuterium": 50}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (current_occupant_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS asteroids (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL,
  star_id INTEGER NOT NULL,
  asteroid_id INTEGER NOT NULL,
  asteroid_type VARCHAR(50), -- C, S, M, D, P, B, Q, R, K, X, T, etc.
  diameter REAL, -- km
  mass REAL, -- Earth masses
  composition JSONB,
  resources JSONB DEFAULT '{"metal": 1000, "crystal": 500, "deuterium": 200}'::jsonb,
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_asteroid_coords UNIQUE(galaxy_id, coordinate_x, coordinate_y, coordinate_z)
);

CREATE TABLE IF NOT EXISTS space_anomalies (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL,
  anomaly_type VARCHAR(50), -- black_hole, neutron_star, wormhole, supernova, etc.
  description VARCHAR(500),
  danger_level INTEGER, -- 1-10
  effects JSONB,
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_stars_galaxy ON stars(galaxy_id);
CREATE INDEX idx_planets_galaxy ON planets(galaxy_id);
CREATE INDEX idx_planets_coordinates ON planets(coordinate_x, coordinate_y, coordinate_z);
CREATE INDEX idx_planets_occupant ON planets(current_occupant_id);
CREATE INDEX idx_moons_planet ON moons(planet_id);
CREATE INDEX idx_asteroids_galaxy ON asteroids(galaxy_id);
CREATE INDEX idx_anomalies_galaxy ON space_anomalies(galaxy_id);
