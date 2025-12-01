import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, FlaskConical, Rocket, Shield, ArrowUpCircle, Box, Gem, Hammer, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FacilityCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources 
}: any) => {
  const metalCost = Math.floor(200 * Math.pow(2, level));
  const crystalCost = Math.floor(100 * Math.pow(2, level));
  const buildTime = (level + 1) * 20; // Mock time

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

export default function Facilities() {
  const { buildings, resources, updateBuilding, queue } = useGame();
  
  const buildQueue = queue.filter(q => q.type === "building");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Facilities</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Construct advanced facilities to research technologies and build fleets.</p>
        </div>

        {/* Construction Queue */}
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
                               <Progress value={Math.max(0, 100 - (timeLeft / 20) * 100)} className="h-1 mt-1" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <FacilityCard 
              id="roboticsFactory"
              name="Robotics Factory"
              level={buildings.roboticsFactory}
              description="Robotics factories provide the construction units to build structures. Each level reduces construction time."
              icon={Factory}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <FacilityCard 
              id="shipyard"
              name="Shipyard"
              level={buildings.shipyard}
              description="The Shipyard constructs your fleet and defense mechanisms. Higher levels allow for faster construction and better ships."
              icon={Rocket}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <FacilityCard 
              id="researchLab"
              name="Research Lab"
              level={buildings.researchLab}
              description="A research lab is required to research new technologies. Higher levels speed up research time."
              icon={FlaskConical}
              resources={resources}
              onUpgrade={updateBuilding}
           />
        </div>
      </div>
    </GameLayout>
  );
}
