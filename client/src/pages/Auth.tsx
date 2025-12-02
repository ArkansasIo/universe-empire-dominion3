import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Shield, Lock, User } from "lucide-react";

export default function Auth() {
  const { login } = useGame();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(username);
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(username);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-slate-950 pointer-events-none"></div>
      
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur border-slate-800 text-white relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-blue-400">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-slate-400 font-rajdhani text-lg">Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-950 border border-slate-800">
              <TabsTrigger value="login" className="font-orbitron data-[state=active]:bg-blue-600 data-[state=active]:text-white">LOGIN</TabsTrigger>
              <TabsTrigger value="register" className="font-orbitron data-[state=active]:bg-blue-600 data-[state=active]:text-white">REGISTER</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Comlink ID (Username)</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        placeholder="Commander Name" 
                        className="bg-slate-950 border-slate-800 pl-10 text-white placeholder:text-slate-600"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Access Code (Password)</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-slate-950 border-slate-800 pl-10 text-white placeholder:text-slate-600"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                   </div>
                </div>
                <Button 
                   type="submit" 
                   className="w-full bg-blue-600 hover:bg-blue-700 font-orbitron tracking-widest h-12 text-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                   disabled={isLoading}
                >
                   {isLoading ? "AUTHENTICATING..." : "ESTABLISH UPLINK"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded text-xs text-blue-300 flex gap-2 items-start">
                   <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                   <span>New commanders are granted a starter planet and basic resource production facilities.</span>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">New Callsign</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        placeholder="Desired Name" 
                        className="bg-slate-950 border-slate-800 pl-10 text-white placeholder:text-slate-600"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Secure Password</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-slate-950 border-slate-800 pl-10 text-white placeholder:text-slate-600"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                   </div>
                </div>
                <Button 
                   type="submit" 
                   className="w-full bg-green-600 hover:bg-green-700 font-orbitron tracking-widest h-12 text-lg shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-all hover:shadow-[0_0_25px_rgba(22,163,74,0.5)]"
                   disabled={isLoading}
                >
                   {isLoading ? "REGISTERING..." : "INITIALIZE COLONY"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-slate-600 pb-6">
           Version {useGame().config?.version || "0.1.0"} // Server: {useGame().config?.universeName || "Nexus"}
        </CardFooter>
      </Card>
    </div>
  );
}
