import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Zap, ArrowUpCircle, Box, Gem, Database, Atom, Cpu, Eye } from "lucide-react";

const ResearchCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources 
}: any) => {
  const metalCost = Math.floor(500 * Math.pow(1.8, level));
  const crystalCost = Math.floor(800 * Math.pow(1.8, level));
  const deutCost = Math.floor(200 * Math.pow(1.8, level));
  
  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost && resources.deuterium >= deutCost;

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
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Research Costs</div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
               <span className={resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900"}>{metalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
               <span className={resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900"}>{crystalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-green-600"><Database className="w-3 h-3" /> Deuterium</span>
               <span className={resources.deuterium < deutCost ? "text-red-600 font-bold" : "text-slate-900"}>{deutCost.toLocaleString()}</span>
            </div>
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron tracking-wider"
            disabled={!canAfford}
            onClick={() => onUpgrade(id)}
         >
           {canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> RESEARCH
             </>
           ) : (
             "INSUFFICIENT RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Research() {
  const { research, resources, updateResearch } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Research Lab</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Unlock new technologies to improve ships, defenses, and resource production.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <ResearchCard 
              id="energyTech"
              name="Energy Technology"
              level={research.energyTech}
              description="The command of different types of energy is necessary for many new technologies."
              icon={Zap}
              resources={resources}
              onUpgrade={updateResearch}
           />
           <ResearchCard 
              id="laserTech"
              name="Laser Technology"
              level={research.laserTech}
              description="A focused beam of light that causes damage when it hits a target."
              icon={Atom}
              resources={resources}
              onUpgrade={updateResearch}
           />
           <ResearchCard 
              id="computerTech"
              name="Computer Technology"
              level={research.computerTech}
              description="Computers are needed to coordinate fleets and manage colonies."
              icon={Cpu}
              resources={resources}
              onUpgrade={updateResearch}
           />
           <ResearchCard 
              id="espionageTech"
              name="Espionage Technology"
              level={research.espionageTech}
              description="Allows you to gather information about other planets."
              icon={Eye}
              resources={resources}
              onUpgrade={updateResearch}
           />
        </div>
      </div>
    </GameLayout>
  );
}
