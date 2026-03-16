import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Shield, Wheat, Droplets } from "lucide-react";

type JobDomain = "civilization" | "military";
type JobRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface JobArchetype {
  id: string;
  name: string;
  domain: JobDomain;
  unitType: string;
  jobType: string;
  subType: string;
  class: string;
  subClass: string;
  title: string;
  rank: number;
  tier: number;
  rarity: JobRarity;
  baseProductivity: number;
  foodDemandPerHour: number;
  waterDemandPerHour: number;
  unlockLevel: number;
}

interface JobsCatalogResponse {
  success: boolean;
  total: number;
  items: JobArchetype[];
}

interface JobsMetaResponse {
  success: boolean;
  meta: {
    total: number;
    domains: {
      civilization: number;
      military: number;
    };
    classes: string[];
    subClasses: string[];
    jobTypes: string[];
    subTypes: string[];
    unitTypes: string[];
  };
}

interface JobsProjectionResponse {
  success: boolean;
  projection: {
    workforce: number;
    projectedProductivity: number;
    foodDemandPerHour: number;
    waterDemandPerHour: number;
  };
}

const rarityBadge: Record<JobRarity, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  uncommon: "bg-emerald-100 text-emerald-700 border-emerald-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-violet-100 text-violet-700 border-violet-300",
  legendary: "bg-amber-100 text-amber-800 border-amber-300",
};

export default function CivilizationSystems() {
  const [domain, setDomain] = useState<"all" | JobDomain>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: catalog, isLoading } = useQuery<JobsCatalogResponse>({
    queryKey: ["/api/config/civilization-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/config/civilization-jobs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load civilization jobs catalog");
      return res.json();
    },
  });

  const { data: meta } = useQuery<JobsMetaResponse>({
    queryKey: ["/api/config/civilization-jobs/meta"],
    queryFn: async () => {
      const res = await fetch("/api/config/civilization-jobs/meta", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load civilization jobs meta");
      return res.json();
    },
  });

  const previewAssignments = useMemo(
    () => [
      { jobId: "civilization-administration-specialist-3", count: 120 },
      { jobId: "civilization-manufacturing-lead-45", count: 300 },
      { jobId: "military-naval-operations-commander-56", count: 80 },
      { jobId: "military-ground-operations-specialist-63", count: 160 },
    ],
    []
  );

  const { data: projection } = useQuery<JobsProjectionResponse>({
    queryKey: ["/api/config/civilization-jobs/projection", "default-preview"],
    queryFn: async () => {
      const res = await fetch("/api/config/civilization-jobs/projection", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments: previewAssignments }),
      });
      if (!res.ok) throw new Error("Failed to load jobs projection");
      return res.json();
    },
  });

  const filteredItems = useMemo(() => {
    const source = catalog?.items || [];
    return source
      .filter((entry) => (domain === "all" ? true : entry.domain === domain))
      .filter((entry) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.trim().toLowerCase();
        return (
          entry.name.toLowerCase().includes(term) ||
          entry.class.toLowerCase().includes(term) ||
          entry.subClass.toLowerCase().includes(term) ||
          entry.jobType.toLowerCase().includes(term) ||
          entry.subType.toLowerCase().includes(term) ||
          entry.unitType.toLowerCase().includes(term)
        );
      });
  }, [catalog?.items, domain, searchTerm]);

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Civilization Systems</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            90-role civilization and military workforce framework with class/subclass and food-water demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-slate-500">Total Roles</div>
              <div className="text-2xl font-orbitron text-slate-900">{meta?.meta.total || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-slate-500">Civilization Roles</div>
              <div className="text-2xl font-orbitron text-slate-900">{meta?.meta.domains.civilization || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-slate-500">Military Roles</div>
              <div className="text-2xl font-orbitron text-slate-900">{meta?.meta.domains.military || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-slate-500">Role Classes</div>
              <div className="text-2xl font-orbitron text-slate-900">{meta?.meta.classes.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="w-5 h-5 text-primary" /> Workforce Projection</CardTitle>
            <CardDescription>Projected totals using default mixed assignments</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="text-xs uppercase text-slate-500">Workforce</div>
              <div className="text-xl font-orbitron text-slate-900">{projection?.projection.workforce?.toLocaleString() || "0"}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="text-xs uppercase text-slate-500">Productivity</div>
              <div className="text-xl font-orbitron text-slate-900">{projection?.projection.projectedProductivity?.toLocaleString() || "0"}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
              <div className="text-xs uppercase text-emerald-700 flex items-center gap-1"><Wheat className="w-3.5 h-3.5" /> Food / Hr</div>
              <div className="text-xl font-orbitron text-emerald-900">{projection?.projection.foodDemandPerHour?.toLocaleString() || "0"}</div>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
              <div className="text-xs uppercase text-cyan-700 flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> Water / Hr</div>
              <div className="text-xl font-orbitron text-cyan-900">{projection?.projection.waterDemandPerHour?.toLocaleString() || "0"}</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <Tabs value={domain} onValueChange={(value) => setDomain(value as "all" | JobDomain)}>
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="civilization">Civilization</TabsTrigger>
              <TabsTrigger value="military">Military</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-full lg:w-80 flex gap-2">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search class, type, role..."
            />
            <Button variant="outline" onClick={() => setSearchTerm("")}>Clear</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(filteredItems || []).map((entry) => (
            <Card key={entry.id} className="bg-white border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="truncate">{entry.name}</span>
                  <Badge variant="outline" className={rarityBadge[entry.rarity]}>{entry.rarity}</Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  {entry.domain === "military" ? <Shield className="w-3.5 h-3.5" /> : <BriefcaseBusiness className="w-3.5 h-3.5" />}
                  {entry.class} • {entry.subClass}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase text-slate-500">Type</div>
                    <div className="font-medium text-slate-800">{entry.jobType}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase text-slate-500">Sub Type</div>
                    <div className="font-medium text-slate-800">{entry.subType}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase text-slate-500">Rank</div>
                    <div className="font-orbitron text-slate-900">{entry.rank}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase text-slate-500">Tier</div>
                    <div className="font-orbitron text-slate-900">{entry.tier}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase text-slate-500">Unlock</div>
                    <div className="font-orbitron text-slate-900">L{entry.unlockLevel}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                    <div className="text-[10px] uppercase text-emerald-700">Food/Hr</div>
                    <div className="font-orbitron text-emerald-900">{entry.foodDemandPerHour}</div>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
                    <div className="text-[10px] uppercase text-cyan-700">Water/Hr</div>
                    <div className="font-orbitron text-cyan-900">{entry.waterDemandPerHour}</div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                    <div className="text-[10px] uppercase text-indigo-700">Productivity</div>
                    <div className="font-orbitron text-indigo-900">{entry.baseProductivity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && filteredItems.length === 0 && (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 text-sm text-slate-600">No job roles found for current filters.</CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
