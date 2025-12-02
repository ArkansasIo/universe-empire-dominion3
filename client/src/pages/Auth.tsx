import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Shield, Lock, User, Info } from "lucide-react";
import { Link } from "wouter";

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-slate-900">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-slate-600 font-rajdhani text-lg font-medium">Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 border border-slate-200">
              <TabsTrigger value="login" className="font-orbitron data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500">LOGIN</TabsTrigger>
              <TabsTrigger value="register" className="font-orbitron data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500">REGISTER</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-900 uppercase">Comlink ID (Username)</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Commander Name" 
                        className="bg-white border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-900 uppercase">Access Code (Password)</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-white border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                   </div>
                </div>
                <Button 
                   type="submit" 
                   className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-12 text-lg shadow-lg transition-all hover:shadow-xl"
                   disabled={isLoading}
                >
                   {isLoading ? "AUTHENTICATING..." : "ESTABLISH UPLINK"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs text-slate-600 flex gap-2 items-start">
                   <Shield className="w-4 h-4 shrink-0 mt-0.5 text-slate-900" />
                   <span>New commanders are granted a starter planet and basic resource production facilities.</span>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-900 uppercase">New Callsign</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Desired Name" 
                        className="bg-white border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-900 uppercase">Secure Password</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-white border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                   </div>
                </div>
                <Button 
                   type="submit" 
                   className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-12 text-lg shadow-lg transition-all hover:shadow-xl"
                   disabled={isLoading}
                >
                   {isLoading ? "REGISTERING..." : "INITIALIZE COLONY"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3 pb-6">
           <Link href="/about">
             <Button variant="ghost" className="text-slate-600 hover:text-slate-900" data-testid="button-about">
               <Info className="w-4 h-4 mr-2" /> About Stellar Dominion
             </Button>
           </Link>
           <span className="text-xs text-slate-500">
             Version {useGame().config?.version || "0.1.0"} // Server: {useGame().config?.universeName || "Nexus"}
           </span>
        </CardFooter>
      </Card>
    </div>
  );
}
