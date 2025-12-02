import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sword, Eye, Flame, Zap } from "lucide-react";
import { useState } from "react";

export default function Combat() {
  const { units, resources } = useGame();
  const [targetCoords, setTargetCoords] = useState("");
  const [combatType, setCombatType] = useState<"raid" | "attack" | "spy" | "sabotage">("raid");
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: number }>({});

  const handleLaunchRaid = async () => {
    if (!targetCoords.trim()) {
      alert("Please enter target coordinates");
      return;
    }

    try {
      const response = await fetch("/api/battles/launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${localStorage.getItem("stellar_username")}:${localStorage.getItem("stellar_password")}`)}`
        },
        body: JSON.stringify({
          type: combatType,
          targetCoordinates: targetCoords,
          units: selectedUnits
        })
      });

      if (!response.ok) throw new Error("Failed to launch raid");
      alert("Raid launched successfully!");
      setTargetCoords("");
      setSelectedUnits({});
    } catch (error) {
      console.error("Error launching raid:", error);
      alert("Failed to launch raid");
    }
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Combat Operations</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Launch raids, attacks, spy missions, or sabotage operations.</p>
        </div>

        <Tabs defaultValue="raid" className="w-full" onValueChange={(v) => setCombatType(v as any)}>
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="raid" className="font-orbitron"><Sword className="w-4 h-4 mr-2" /> Raid</TabsTrigger>
            <TabsTrigger value="attack" className="font-orbitron"><Flame className="w-4 h-4 mr-2" /> Attack</TabsTrigger>
            <TabsTrigger value="spy" className="font-orbitron"><Eye className="w-4 h-4 mr-2" /> Espionage</TabsTrigger>
            <TabsTrigger value="sabotage" className="font-orbitron"><Zap className="w-4 h-4 mr-2" /> Sabotage</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2 bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Sword className="w-5 h-5 text-primary" /> Fleet Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-900 block mb-2">Target Coordinates</label>
                  <Input
                    placeholder="e.g., [1:2:3]"
                    value={targetCoords}
                    onChange={(e) => setTargetCoords(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="text-sm font-bold text-slate-900 mb-3">Available Fleet</div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {Object.entries(units || {}).map(([unitId, count]) => (
                      <div key={unitId} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                        <span className="capitalize text-sm">{unitId}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{count} available</span>
                          <Input
                            type="number"
                            min="0"
                            max={count}
                            placeholder="0"
                            value={selectedUnits[unitId] || 0}
                            onChange={(e) => {
                              const val = Math.min(parseInt(e.target.value) || 0, count);
                              setSelectedUnits(prev => ({ ...prev, [unitId]: val }));
                            }}
                            className="w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleLaunchRaid} className="w-full bg-primary hover:bg-primary/90" data-testid="button-launch-raid">
                  Launch {combatType.toUpperCase()}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm">Mission Info</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-3">
                  <div>
                    <div className="text-slate-500 mb-1">Mission Type</div>
                    <Badge className="capitalize">{combatType}</Badge>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Selected Units</div>
                    <div className="font-mono text-sm">{Object.values(selectedUnits || {}).reduce((a, b) => a + b, 0)} ships</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Cargo Capacity</div>
                    <div className="font-mono text-sm">~{Object.values(selectedUnits || {}).reduce((a, b) => a + b, 0) * 50}k</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 text-xs text-slate-700">
                  <strong>Raid:</strong> Attack to steal resources. <br/>
                  <strong>Attack:</strong> Destroy enemy fleet. <br/>
                  <strong>Spy:</strong> Gather intelligence. <br/>
                  <strong>Sabotage:</strong> Damage buildings.
                </CardContent>
              </Card>
            </div>
          </div>

          <TabsContent value="raid" className="mt-6" />
          <TabsContent value="attack" className="mt-6" />
          <TabsContent value="spy" className="mt-6" />
          <TabsContent value="sabotage" className="mt-6" />
        </Tabs>
      </div>
    </GameLayout>
  );
}
