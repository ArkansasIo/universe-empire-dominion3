import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Users, Swords, Star, Shield, Activity, Plus } from "lucide-react";

interface Troop {
  id: string;
  name: string;
  troopType: "infantry" | "cavalry" | "mage" | "archer" | "support" | "siege";
  troopClass: string;
  rank: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  morale: number;
  status: "active" | "wounded" | "resting" | "dead";
  experience: number;
}

const TROOP_TYPES = ["infantry", "cavalry", "mage", "archer", "support", "siege"];
const TROOP_CLASSES = ["warrior", "knight", "berserker", "paladin", "ranger", "scout", "mage", "healer", "engineer"];
const RANKS = ["recruit", "soldier", "veteran", "elite", "commander", "general"];

const MOCK_TROOPS: Troop[] = [
  {
    id: "1",
    name: "Ironforge The Brave",
    troopType: "infantry",
    troopClass: "warrior",
    rank: "veteran",
    level: 5,
    health: 85,
    maxHealth: 100,
    attack: 18,
    defense: 12,
    speed: 8,
    morale: 95,
    status: "active",
    experience: 2340,
  },
  {
    id: "2",
    name: "Swift Arrow",
    troopType: "archer",
    troopClass: "ranger",
    rank: "soldier",
    level: 3,
    health: 100,
    maxHealth: 100,
    attack: 22,
    defense: 6,
    speed: 14,
    morale: 85,
    status: "active",
    experience: 1200,
  },
];

export default function Army() {
  const [troops, setTroops] = useState<Troop[]>(MOCK_TROOPS);
  const [selectedSquadFilter, setSelectedSquadFilter] = useState("all");
  const [newTroopName, setNewTroopName] = useState("");

  const getTroopTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      infantry: "🛡️",
      cavalry: "🐴",
      mage: "✨",
      archer: "🏹",
      support: "🏥",
      siege: "🏰",
    };
    return icons[type] || "⚔️";
  };

  const getRankColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      recruit: "bg-slate-200",
      soldier: "bg-blue-200",
      veteran: "bg-purple-200",
      elite: "bg-orange-200",
      commander: "bg-red-200",
      general: "bg-gold-200",
    };
    return colors[rank] || "bg-slate-200";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      wounded: "bg-yellow-100 text-yellow-800",
      resting: "bg-blue-100 text-blue-800",
      dead: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-slate-100";
  };

  const handleRecruit = async () => {
    if (!newTroopName.trim()) return;
    
    const newTroop: Troop = {
      id: Math.random().toString(),
      name: newTroopName,
      troopType: TROOP_TYPES[Math.floor(Math.random() * TROOP_TYPES.length)] as any,
      troopClass: TROOP_CLASSES[Math.floor(Math.random() * TROOP_CLASSES.length)],
      rank: "recruit",
      level: 1,
      health: 100,
      maxHealth: 100,
      attack: 8,
      defense: 4,
      speed: 6,
      morale: 100,
      status: "active",
      experience: 0,
    };

    setTroops([...troops, newTroop]);
    setNewTroopName("");
  };

  const totalTroops = troops.length;
  const activeTroops = troops.filter(t => t.status === "active").length;
  const averageMorale = Math.round(troops.reduce((sum, t) => sum + t.morale, 0) / troops.length);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Army Management</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Recruit, manage, and deploy your troops for battle.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-bold">TOTAL TROOPS</p>
                  <p className="text-3xl font-orbitron font-bold text-blue-900">{totalTroops}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-bold">ACTIVE</p>
                  <p className="text-3xl font-orbitron font-bold text-green-900">{activeTroops}</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-bold">AVG MORALE</p>
                  <p className="text-3xl font-orbitron font-bold text-purple-900">{averageMorale}%</p>
                </div>
                <Star className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-bold">POWER LEVEL</p>
                  <p className="text-3xl font-orbitron font-bold text-orange-900">{(totalTroops * 25).toLocaleString()}</p>
                </div>
                <Swords className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recruit Section */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Plus className="w-5 h-5 text-primary" /> Recruit New Troop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter troop name (e.g., 'Ironforge the Brave')"
                value={newTroopName}
                onChange={(e) => setNewTroopName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRecruit()}
                data-testid="input-troop-name"
              />
              <Button onClick={handleRecruit} className="bg-primary hover:bg-primary/90" data-testid="button-recruit">
                Recruit
              </Button>
            </div>
            <p className="text-xs text-slate-500">Recruitment cost: 100 metal, 50 crystal</p>
          </CardContent>
        </Card>

        {/* Troops List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="all">All Troops ({totalTroops})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeTroops})</TabsTrigger>
            <TabsTrigger value="squads">Squads (3)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {troops.map((troop) => (
                <Card key={troop.id} className="bg-white border-slate-200 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Identity */}
                      <div>
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">{getTroopTypeIcon(troop.troopType)}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">{troop.name}</h3>
                            <p className="text-xs text-slate-600 capitalize">{troop.troopType} • {troop.troopClass}</p>
                            <div className="flex gap-1 mt-1">
                              <Badge className={`${getRankColor(troop.rank)} text-xs capitalize`}>{troop.rank}</Badge>
                              <Badge className="bg-slate-100 text-xs">Lvl {troop.level}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Health & Status */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">HEALTH</p>
                        <div className="bg-slate-100 rounded h-3 overflow-hidden mb-2">
                          <div 
                            className="bg-green-500 h-full transition-all"
                            style={{ width: `${(troop.health / troop.maxHealth) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600">{troop.health}/{troop.maxHealth} HP</p>
                        <Badge className={getStatusColor(troop.status)}>
                          {troop.status.charAt(0).toUpperCase() + troop.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">STATS</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">⚔️ Attack:</span>
                            <span className="font-bold text-slate-900">{troop.attack}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">🛡️ Defense:</span>
                            <span className="font-bold text-slate-900">{troop.defense}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">💨 Speed:</span>
                            <span className="font-bold text-slate-900">{troop.speed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">😊 Morale:</span>
                            <span className="font-bold text-slate-900">{troop.morale}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Experience & Actions */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">EXPERIENCE</p>
                        <div className="bg-slate-100 rounded h-3 overflow-hidden mb-2">
                          <div 
                            className="bg-blue-500 h-full transition-all"
                            style={{ width: `${Math.min((troop.experience / 5000) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{troop.experience.toLocaleString()} XP</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" data-testid={`button-manage-${troop.id}`}>
                            Manage
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs" data-testid={`button-deploy-${troop.id}`}>
                            Deploy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {troops.filter(t => t.status === "active").map((troop) => (
                <Card key={troop.id} className="bg-white border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTroopTypeIcon(troop.troopType)}</span>
                        <div>
                          <h3 className="font-bold text-slate-900">{troop.name}</h3>
                          <p className="text-xs text-slate-600">{troop.troopClass} - Level {troop.level}</p>
                        </div>
                      </div>
                      <Button size="sm" data-testid={`button-deploy-active-${troop.id}`}>Deploy</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="squads" className="space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="w-5 h-5" /> Strike Squadron
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {troops.slice(0, 2).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span>{getTroopTypeIcon(t.troopType)} {t.name}</span>
                      <Badge>Commander</Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" data-testid="button-deploy-squad">Deploy Squad</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
