import React, { useEffect, useState } from 'react';

interface ResourceEntry {
  player: string;
  planet: string | number;
  amount: unknown;
}

const ResourceManager: React.FC = () => {
  const [resources, setResources] = useState<ResourceEntry[]>([]);
  const fetchResources = () => {
    fetch('/api/players')
      .then(res => res.json())
      .then(players => {
        // Aggregate resources from all players' planets
        const allResources: ResourceEntry[] = [];
        players.forEach((player: any) => {
          (player.sectorsOwned || []).forEach((sector: any) => {
            (sector.planets || []).forEach((planet: any) => {
              allResources.push({
                player: player.name,
                planet: planet.id,
                amount: planet.resources
              });
            });
          });
        });
        setResources(allResources);
      });
  };
  useEffect(() => {
    fetchResources();
    const handler = () => fetchResources();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);
  return (
    <div>
      <h2>Resource Manager</h2>
      <ul>
        {resources.map((r, i) => (
          <li key={i}>{r.player} - {r.planet}: {JSON.stringify(r.amount)}</li>
        ))}
      </ul>
    </div>
  );
};
export default ResourceManager;
