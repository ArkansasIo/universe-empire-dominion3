import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rocket, MapPin, Crosshair, Truck, Search } from "lucide-react";

export default function Fleet() {
  const { units } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Fleet Command</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Select ships and dispatch them on missions across the galaxy.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Ship Selection */}
          <Card className="col-span-2 bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                <Rocket className="w-5 h-5 text-primary" /> Select Fleet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="text-slate-900">Unit Type</TableHead>
                    <TableHead className="text-right text-slate-900">Available</TableHead>
                    <TableHead className="text-right text-slate-900 w-[100px]">Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(units).map(([key, count]) => (
                    count > 0 && (
                      <TableRow key={key} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-medium capitalize text-slate-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-primary">{count}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="h-8 bg-slate-50 border-slate-200 text-right w-20 ml-auto text-slate-900" 
                          />
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                  {Object.values(units).every(val => val === 0) && (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                           No units available. Build some in the Shipyard!
                        </TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Right Column: Mission Details */}
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
               <CardHeader>
                 <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                   <MapPin className="w-5 h-5 text-blue-600" /> Destination
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                     <div>
                        <label className="text-xs text-muted-foreground uppercase">Galaxy</label>
                        <Input defaultValue="1" className="bg-slate-50 border-slate-200 font-mono text-slate-900" />
                     </div>
                     <div>
                        <label className="text-xs text-muted-foreground uppercase">System</label>
                        <Input defaultValue="102" className="bg-slate-50 border-slate-200 font-mono text-slate-900" />
                     </div>
                     <div>
                        <label className="text-xs text-muted-foreground uppercase">Planet</label>
                        <Input defaultValue="8" className="bg-slate-50 border-slate-200 font-mono text-slate-900" />
                     </div>
                  </div>
                  
                  <Select defaultValue="planet">
                     <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                        <SelectValue placeholder="Target Type" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="planet">Planet</SelectItem>
                        <SelectItem value="debris">Debris Field</SelectItem>
                        <SelectItem value="moon">Moon</SelectItem>
                     </SelectContent>
                  </Select>
               </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
               <CardHeader>
                 <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                   <Crosshair className="w-5 h-5 text-red-600" /> Mission
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 hover:text-primary text-slate-700">
                     <Search className="w-4 h-4 mr-2 text-blue-600" /> Espionage
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 hover:text-primary text-slate-700">
                     <Crosshair className="w-4 h-4 mr-2 text-red-600" /> Attack
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 hover:text-primary text-slate-700">
                     <Truck className="w-4 h-4 mr-2 text-green-600" /> Transport
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 hover:text-primary text-slate-700">
                     <MapPin className="w-4 h-4 mr-2 text-yellow-600" /> Colonize
                  </Button>
               </CardContent>
            </Card>
            
            <Button className="w-full bg-primary text-white hover:bg-primary/90 font-bold font-orbitron h-12 text-lg shadow-md">
               SEND FLEET
            </Button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
