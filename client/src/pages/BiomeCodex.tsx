import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Compass, Filter, Search } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type BiomeEnvironmentType = 'planet' | 'moon' | 'colony' | 'space-station' | 'starbase' | 'moon-base';
type BiomeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

type StarfleetBiomeEntry = {
  id: string;
  code: string;
  letter: string;
  name: string;
  environmentType: BiomeEnvironmentType;
  biomeType: string;
  biomeSubType: string;
  class: string;
  subClass: string;
  size: 'micro' | 'small' | 'medium' | 'large' | 'massive' | 'mega';
  rank: number;
  title: string;
  rarity: BiomeRarity;
  colonyCapacity: number;
  description: string;
  hazards: string[];
  strategicUses: string[];
};

type CatalogResponse = {
  meta: {
    total: number;
    lettersCovered: string[];
    byEnvironment: Record<string, number>;
  };
  biomes: StarfleetBiomeEntry[];
};

const ENV_OPTIONS: Array<{ value: BiomeEnvironmentType | 'all'; label: string }> = [
  { value: 'all', label: 'All Environments' },
  { value: 'planet', label: 'Planets' },
  { value: 'moon', label: 'Moons' },
  { value: 'colony', label: 'Colonies' },
  { value: 'space-station', label: 'Space Stations' },
  { value: 'starbase', label: 'Starbases' },
  { value: 'moon-base', label: 'Moon Bases' },
];

const RARITY_OPTIONS: Array<{ value: BiomeRarity | 'all'; label: string }> = [
  { value: 'all', label: 'All Rarities' },
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function rarityClass(rarity: BiomeRarity) {
  switch (rarity) {
    case 'legendary': return 'bg-amber-100 text-amber-900 border-amber-300';
    case 'epic': return 'bg-purple-100 text-purple-900 border-purple-300';
    case 'rare': return 'bg-blue-100 text-blue-900 border-blue-300';
    case 'uncommon': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    default: return 'bg-slate-100 text-slate-900 border-slate-300';
  }
}

export default function BiomeCodex() {
  const [search, setSearch] = useState('');
  const [environment, setEnvironment] = useState<BiomeEnvironmentType | 'all'>('all');
  const [rarity, setRarity] = useState<BiomeRarity | 'all'>('all');
  const [letter, setLetter] = useState<string>('all');
  const [cls, setCls] = useState<string>('all');
  const [subClass, setSubClass] = useState<string>('all');

  const catalogQuery = useQuery<CatalogResponse>({ queryKey: ['/api/biomes/catalog'] });

  const classOptions = useMemo(() => {
    const all = new Set((catalogQuery.data?.biomes || []).map((entry) => entry.class));
    return ['all', ...Array.from(all).sort()];
  }, [catalogQuery.data?.biomes]);

  const subClassOptions = useMemo(() => {
    const all = new Set((catalogQuery.data?.biomes || []).map((entry) => entry.subClass));
    return ['all', ...Array.from(all).sort()];
  }, [catalogQuery.data?.biomes]);

  const filtered = useMemo(() => {
    const items = catalogQuery.data?.biomes || [];
    const query = search.trim().toLowerCase();

    return items.filter((entry) => {
      if (environment !== 'all' && entry.environmentType !== environment) return false;
      if (rarity !== 'all' && entry.rarity !== rarity) return false;
      if (letter !== 'all' && entry.letter !== letter) return false;
      if (cls !== 'all' && entry.class !== cls) return false;
      if (subClass !== 'all' && entry.subClass !== subClass) return false;

      if (!query) return true;
      return [
        entry.name,
        entry.code,
        entry.biomeType,
        entry.biomeSubType,
        entry.class,
        entry.subClass,
        entry.title,
        entry.environmentType,
        entry.description,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [catalogQuery.data?.biomes, search, environment, rarity, letter, cls, subClass]);

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="biome-codex-page">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" /> Biome Codex
          </h1>
          <p className="text-slate-600">90-entry A–Z biome registry for planets, moons, colonies, stations, starbases, and moon bases.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Total Catalog</div><div className="text-2xl font-orbitron font-bold">{catalogQuery.data?.meta.total || 0}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Filtered</div><div className="text-2xl font-orbitron font-bold text-blue-700">{filtered.length}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Letters</div><div className="text-2xl font-orbitron font-bold text-purple-700">{catalogQuery.data?.meta.lettersCovered?.length || 0}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Biomes Loaded</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{catalogQuery.isLoading ? '...' : 'Ready'}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Filter className="w-4 h-4" /> Codex Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
            <div className="xl:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search biome, code, class, title..." className="pl-9" />
              </div>
            </div>
            <Select value={environment} onValueChange={(value) => setEnvironment(value as BiomeEnvironmentType | 'all')}>
              <SelectTrigger><SelectValue placeholder="Environment" /></SelectTrigger>
              <SelectContent>{ENV_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={rarity} onValueChange={(value) => setRarity(value as BiomeRarity | 'all')}>
              <SelectTrigger><SelectValue placeholder="Rarity" /></SelectTrigger>
              <SelectContent>{RARITY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={cls} onValueChange={setCls}>
              <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>{classOptions.map((option) => <SelectItem key={option} value={option}>{option === 'all' ? 'All Classes' : option}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={subClass} onValueChange={setSubClass}>
              <SelectTrigger><SelectValue placeholder="Sub-Class" /></SelectTrigger>
              <SelectContent>{subClassOptions.map((option) => <SelectItem key={option} value={option}>{option === 'all' ? 'All Sub-Classes' : option}</SelectItem>)}</SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Compass className="w-4 h-4" /> Letter Index (A–Z)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge className={letter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 cursor-pointer'} onClick={() => setLetter('all')}>ALL</Badge>
              {LETTERS.map((entryLetter) => (
                <Badge
                  key={entryLetter}
                  className={letter === entryLetter ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700 cursor-pointer'}
                  onClick={() => setLetter(entryLetter)}
                >
                  {entryLetter}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <Card key={entry.id} className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="truncate">{entry.name}</span>
                  <Badge className={rarityClass(entry.rarity)}>{entry.rarity}</Badge>
                </CardTitle>
                <div className="text-xs text-slate-500 font-mono">{entry.code} • Rank {entry.rank} • {entry.title}</div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-slate-500">Environment:</span> <span className="font-semibold">{entry.environmentType}</span></div>
                <div><span className="text-slate-500">Type:</span> <span className="font-semibold">{entry.biomeType} / {entry.biomeSubType}</span></div>
                <div><span className="text-slate-500">Class:</span> <span className="font-semibold">{entry.class} / {entry.subClass}</span></div>
                <div><span className="text-slate-500">Size:</span> <span className="font-semibold">{entry.size}</span> • <span className="text-slate-500">Capacity:</span> <span className="font-semibold">{entry.colonyCapacity}</span></div>
                <p className="text-slate-600 line-clamp-3">{entry.description}</p>
                <div className="pt-1">
                  <div className="text-xs text-slate-500 uppercase mb-1">Hazards</div>
                  <div className="flex flex-wrap gap-1">{entry.hazards.map((hazard) => <Badge key={hazard} variant="outline" className="text-[10px]">{hazard}</Badge>)}</div>
                </div>
                <div className="pt-2">
                  <Link href={`/biome/${entry.id}`}>
                    <Button size="sm" className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
