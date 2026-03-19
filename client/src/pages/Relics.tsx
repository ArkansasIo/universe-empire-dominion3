import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Compass, FlaskConical, Lock, Shield, Sparkles, Wrench } from "lucide-react";
import { useArtifactRelicSystems } from "@/lib/artifactRelicSystems";

const rarityClass = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-300",
  ancient: "bg-rose-100 text-rose-700 border-rose-300",
};

function msToProgress(startedAt?: number, endsAt?: number) {
  if (!startedAt || !endsAt) return 0;
  const total = endsAt - startedAt;
  const elapsed = Date.now() - startedAt;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, Math.floor((elapsed / total) * 100)));
}

export default function Relics() {
  const {
    state,
    summary,
    unlockRelic,
    upgradeRelic,
    startResearch,
    launchExpedition,
  } = useArtifactRelicSystems();

  const activeResearch = state.research.find((research) => research.status === "in_progress");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Relic Systems</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Operate relic upgrades, relic research, and expedition support from one command panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Unlocked Relics</div>
              <div className="text-2xl font-bold text-slate-900">{summary.unlockedRelics}/{summary.totalRelics}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Relic Essence</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicEssence}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Relic Shards</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicShards}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Research Data</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.researchData}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {state.relics.map((relic) => {
            const locked = relic.unlockCost > 0;
            const upgradeEssence = Math.floor(18 * relic.level);
            const upgradeShards = Math.floor(14 * relic.level);

            return (
              <Card key={relic.id} className="bg-white border-slate-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        {relic.name}
                      </CardTitle>
                      <CardDescription>{relic.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={rarityClass[relic.rarity]}>{relic.rarity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                      <span className="text-slate-500">Level:</span> <span className="font-semibold">{relic.level}</span>
                    </div>
                    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                      <span className="text-slate-500">Research:</span> <span className="font-semibold">{relic.researchLevel}</span>
                    </div>
                  </div>

                  <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm">
                    Condition: <span className="font-semibold">{relic.condition}%</span>
                    <Progress value={relic.condition} className="h-2 mt-2" />
                  </div>

                  <div className="space-y-1">
                    {relic.bonuses.map((bonus, index) => (
                      <div key={`${relic.id}-bonus-${index}`} className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 rounded px-2 py-1">
                        {bonus}
                      </div>
                    ))}
                  </div>

                  {locked ? (
                    <Button
                      className="w-full"
                      onClick={() => unlockRelic(relic.id)}
                      disabled={state.resources.relicEssence < relic.unlockCost}
                      data-testid={`button-unlock-relic-${relic.id}`}
                    >
                      <Lock className="w-4 h-4 mr-2" /> Unlock ({relic.unlockCost} essence)
                    </Button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => upgradeRelic(relic.id)}
                        disabled={state.resources.relicEssence < upgradeEssence || state.resources.relicShards < upgradeShards}
                        data-testid={`button-upgrade-relic-${relic.id}`}
                      >
                        <Wrench className="w-4 h-4 mr-1" /> Upgrade
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startResearch("relic", relic.id)}
                        disabled={!!activeResearch}
                        data-testid={`button-research-relic-${relic.id}`}
                      >
                        <FlaskConical className="w-4 h-4 mr-1" /> Research
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => launchExpedition("relic", relic.id)}
                        disabled={state.resources.archaeologyCrews <= 0}
                        data-testid={`button-expedition-relic-${relic.id}`}
                      >
                        <Compass className="w-4 h-4 mr-1" /> Expedition
                      </Button>
                    </div>
                  )}

                  {locked && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      Locked relic. Unlock before upgrade/research/expedition operations.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-600" /> Relic Research & Expedition Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.research.filter((research) => research.targetType === "relic").length === 0 && state.expeditions.filter((expedition) => expedition.targetType === "relic").length === 0 ? (
              <p className="text-sm text-slate-500">No relic activity yet.</p>
            ) : (
              <>
                {state.research
                  .filter((research) => research.targetType === "relic")
                  .map((research) => (
                    <div key={research.id} className="rounded border border-slate-200 p-2 bg-slate-50 text-sm text-slate-700">
                      Research: {research.targetName} • {research.status}
                      {research.status === "in_progress" && (
                        <Progress value={msToProgress(research.startedAt, research.endsAt)} className="h-2 mt-2" />
                      )}
                    </div>
                  ))}

                {state.expeditions
                  .filter((expedition) => expedition.targetType === "relic")
                  .map((expedition) => (
                    <div key={expedition.id} className="rounded border border-slate-200 p-2 bg-slate-50 text-sm text-slate-700">
                      Expedition: {expedition.name} • {expedition.status}
                      {expedition.status === "in_progress" && (
                        <Progress value={msToProgress(expedition.startedAt, expedition.endsAt)} className="h-2 mt-2" />
                      )}
                    </div>
                  ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
