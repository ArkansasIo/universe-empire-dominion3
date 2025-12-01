import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ChevronLeft, ChevronRight, MessageSquare, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function Galaxy() {
  const [system, setSystem] = useState(102);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Galaxy View</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Scan surrounding systems for resources and potential threats.</p>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex justify-center items-center gap-4 shadow-sm">
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-16 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" defaultValue="1" />
                 <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-16 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={system} onChange={(e) => setSystem(parseInt(e.target.value))} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           <Button className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30">
              Show Expedition
           </Button>
        </div>

        {/* Galaxy Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
           <Table>
             <TableHeader>
               <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                 <TableHead className="text-center w-[80px] text-slate-700">Pos</TableHead>
                 <TableHead className="w-[100px] text-slate-700">Image</TableHead>
                 <TableHead className="text-slate-700">Planet</TableHead>
                 <TableHead className="text-slate-700">Moon</TableHead>
                 <TableHead className="text-slate-700">Debris</TableHead>
                 <TableHead className="text-slate-700">Player</TableHead>
                 <TableHead className="text-slate-700">Alliance</TableHead>
                 <TableHead className="text-right text-slate-700">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {Array.from({ length: 15 }).map((_, i) => {
                 const pos = i + 1;
                 // Mock Data Logic
                 const isOccupied = pos === 8 || pos === 4 || pos === 12;
                 const isMe = pos === 8;
                 
                 return (
                   <TableRow key={pos} className="border-slate-100 hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center font-mono text-muted-foreground">{pos}</TableCell>
                      <TableCell>
                         {isOccupied && (
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 shadow-sm border border-slate-200"></div>
                         )}
                      </TableCell>
                      <TableCell>
                         {isOccupied ? (
                            <div>
                               <div className={isMe ? "text-primary font-bold" : "text-slate-700"}>{isMe ? "Homeworld" : `Colony ${pos}`}</div>
                               {isMe && <div className="text-xs text-primary/80">[Active]</div>}
                            </div>
                         ) : (
                            <span className="text-muted-foreground/30 italic">-- Empty Space --</span>
                         )}
                      </TableCell>
                      <TableCell>
                         {pos === 12 && <div className="w-4 h-4 rounded-full bg-slate-300" title="Moon"></div>}
                      </TableCell>
                      <TableCell>
                         {pos === 4 && <div className="text-xs text-yellow-600 font-mono">T: 5.2k M: 2.1k</div>}
                      </TableCell>
                      <TableCell>
                         {isOccupied && (
                            <span className={isMe ? "text-green-600" : "text-red-500"}>
                               {isMe ? "Commander" : `Enemy_${pos}`}
                            </span>
                         )}
                      </TableCell>
                      <TableCell>
                         {isOccupied && !isMe && <span className="text-blue-500">[NOOBS]</span>}
                      </TableCell>
                      <TableCell className="text-right">
                         {isOccupied && !isMe && (
                            <div className="flex justify-end gap-2">
                               <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"><MessageSquare className="w-4 h-4" /></Button>
                               <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50 hover:text-red-600"><ShieldAlert className="w-4 h-4" /></Button>
                            </div>
                         )}
                      </TableCell>
                   </TableRow>
                 );
               })}
             </TableBody>
           </Table>
        </div>
      </div>
    </GameLayout>
  );
}
