import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Gem, Database, Zap, ArrowUpCircle, Hammer, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const BuildingCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources 
}: any) => {
  const metalCost = Math.floor(100 * Math.pow(1.5, level));
  const crystalCost = Math.floor(50 * Math.pow(1.5, level));
  const buildTime = (level + 1) * 10; // Mock time

  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost;

  return (
    <Card className="bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm">
       <div className="h-32 bg-slate-100 relative group-hover:bg-slate-200 transition-colors duration-500 border-b border-slate-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-slate-300 group-hover:text-primary/20 transition-colors" />
          </div>
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs font-mono text-primary border border-slate-200 shadow-sm">
            Lvl {level}
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900 group-hover:text-primary transition-colors">{name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2">
         <p className="text-sm text-muted-foreground min-h-[3rem]">{description}</p>
         
         <div className="mt-4 space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Upgrade Costs</div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
               <span className={resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900"}>{metalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
               <span className={resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900"}>{crystalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-500"><Clock className="w-3 h-3" /> Time</span>
               <span className="text-slate-900">{buildTime}s</span>
            </div>
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron tracking-wider"
            disabled={!canAfford}
            onClick={() => onUpgrade(id, name, buildTime * 1000)}
         >
           {canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> UPGRADE
             </>
           ) : (
             "INSUFFICIENT RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Resources() {
  const { buildings, resources, updateBuilding, queue } = useGame();

  const buildQueue = queue.filter(q => q.type === "building");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Resource Buildings</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage your resource production infrastructure.</p>
        </div>

        {/* Building Queue */}
        {buildQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm mb-6">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Hammer className="w-4 h-4" /> Construction Queue
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {buildQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      return (
                         <div key={i} className="flex items-center gap-4 bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-slate-200">
                               <Hammer className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between text-sm font-medium text-slate-900">
                                  <span>{item.name}</span>
                                  <span className="font-mono text-primary">{timeLeft}s</span>
                               </div>
                               <Progress value={Math.max(0, 100 - (timeLeft / 10) * 100)} className="h-1 mt-1" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <BuildingCard 
              id="metalMine"
              name="Metal Mine"
              level={buildings.metalMine}
              description="Used in the extraction of metal ore, metal mines are the primary source of resources for your empire."
              icon={Box}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <BuildingCard 
              id="crystalMine"
              name="Crystal Mine"
              level={buildings.crystalMine}
              description="Crystals are the main resource used for electronic circuits and form certain alloy compounds."
              icon={Gem}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <BuildingCard 
              id="deuteriumSynthesizer"
              name="Deuterium Synthesizer"
              level={buildings.deuteriumSynthesizer}
              description="Deuterium is a heavy isotope of hydrogen. It is used as fuel for spaceships and is harvested in the deep sea."
              icon={Database}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <BuildingCard 
              id="solarPlant"
              name="Solar Plant"
              level={buildings.solarPlant}
              description="Solar power plants absorb energy from solar radiation. All mines need energy to operate."
              icon={Zap}
              resources={resources}
              onUpgrade={updateBuilding}
           />
        </div>
      </div>
    </GameLayout>
  );
}
