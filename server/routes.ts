import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

// Helper to get user ID from authenticated request
function getUserId(req: any): string {
  return req.user?.claims?.sub;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==== PLAYER STATE ROUTES ====
  
  // Get player state (with initialization if needed)
  app.get("/api/game/state", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      let state = await storage.getPlayerState(userId);
      
      // Initialize state if it doesn't exist
      if (!state) {
        const user = await storage.getUser(userId);
        const displayName = user?.firstName || user?.email?.split('@')[0] || 'Commander';
        
        state = await storage.createPlayerState({
          userId,
          planetName: `${displayName}'s Colony`,
          coordinates: `[${Math.floor(Math.random() * 9) + 1}:${Math.floor(Math.random() * 50) + 1}:${Math.floor(Math.random() * 15) + 1}]`,
          resources: { metal: 1000, crystal: 500, deuterium: 0, energy: 0 },
          buildings: { roboticsFactory: 0, shipyard: 0, researchLab: 0 },
          orbitalBuildings: {},
          research: {},
          units: {},
          commander: {
            name: displayName,
            race: "terran",
            class: "admiral",
            subClass: null,
            stats: { level: 1, xp: 0, warfare: 10, logistics: 10, science: 10, engineering: 10 },
            equipment: { weapon: null, armor: null, module: null },
            inventory: []
          },
          government: {
            type: "democracy",
            taxRate: 20,
            policies: [],
            stats: { stability: 50, efficiency: 50, militaryReadiness: 50, approval: 50 }
          },
          artifacts: [],
          cronJobs: [
            { id: "resource_tick", name: "Resource Production", enabled: true, interval: 10000, lastRun: Date.now() }
          ]
        });
      }
      
      res.json(state);
    } catch (error) {
      console.error("Error fetching player state:", error);
      res.status(500).json({ message: "Failed to fetch player state" });
    }
  });
  
  // Update player state
  app.patch("/api/game/state", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      
      const state = await storage.updatePlayerState(userId, updates);
      res.json(state);
    } catch (error) {
      console.error("Error updating player state:", error);
      res.status(500).json({ message: "Failed to update player state" });
    }
  });
  
  // ==== MISSION ROUTES ====
  
  // Get active missions
  app.get("/api/missions/active", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const missions = await storage.getActiveMissions(userId);
      res.json(missions);
    } catch (error) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });
  
  // Get all missions
  app.get("/api/missions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const missions = await storage.getMissionsByUser(userId);
      res.json(missions);
    } catch (error) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });
  
  // Create new mission
  app.post("/api/missions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const missionData = { ...req.body, userId };
      
      const mission = await storage.createMission(missionData);
      res.json(mission);
    } catch (error) {
      console.error("Error creating mission:", error);
      res.status(500).json({ message: "Failed to create mission" });
    }
  });
  
  // Update mission
  app.patch("/api/missions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const mission = await storage.updateMission(id, updates);
      res.json(mission);
    } catch (error) {
      console.error("Error updating mission:", error);
      res.status(500).json({ message: "Failed to update mission" });
    }
  });
  
  // Delete mission
  app.delete("/api/missions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMission(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting mission:", error);
      res.status(500).json({ message: "Failed to delete mission" });
    }
  });
  
  // ==== MESSAGE ROUTES ====
  
  // Get messages
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const limit = parseInt(req.query.limit as string) || 50;
      
      const messages = await storage.getMessagesByUser(userId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Get unread count
  app.get("/api/messages/unread-count", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const count = await storage.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });
  
  // Send message
  app.post("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const displayName = user?.firstName || user?.email?.split('@')[0] || 'Commander';
      
      const messageData = {
        ...req.body,
        fromUserId: userId,
        from: displayName
      };
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Mark message as read
  app.patch("/api/messages/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markMessageAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });
  
  // Delete message
  app.delete("/api/messages/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMessage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });
  
  // ==== ALLIANCE ROUTES ====
  
  // Get all alliances
  app.get("/api/alliances", isAuthenticated, async (req: any, res) => {
    try {
      const alliances = await storage.getAllAlliances();
      res.json(alliances);
    } catch (error) {
      console.error("Error fetching alliances:", error);
      res.status(500).json({ message: "Failed to fetch alliances" });
    }
  });
  
  // Get user's alliance
  app.get("/api/alliances/mine", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const result = await storage.getUserAlliance(userId);
      res.json(result || null);
    } catch (error) {
      console.error("Error fetching user alliance:", error);
      res.status(500).json({ message: "Failed to fetch user alliance" });
    }
  });
  
  // Get alliance members
  app.get("/api/alliances/:id/members", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const members = await storage.getAllianceMembers(id);
      res.json(members);
    } catch (error) {
      console.error("Error fetching alliance members:", error);
      res.status(500).json({ message: "Failed to fetch alliance members" });
    }
  });
  
  // Create alliance
  app.post("/api/alliances", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const displayName = user?.firstName || user?.email?.split('@')[0] || 'Commander';
      
      // Create alliance
      const alliance = await storage.createAlliance(req.body);
      
      // Add creator as leader
      await storage.addAllianceMember({
        allianceId: alliance.id,
        userId,
        rank: "leader",
        points: 1000
      });
      
      res.json(alliance);
    } catch (error) {
      console.error("Error creating alliance:", error);
      res.status(500).json({ message: "Failed to create alliance" });
    }
  });
  
  // Join alliance
  app.post("/api/alliances/:id/join", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;
      
      const member = await storage.addAllianceMember({
        allianceId: id,
        userId,
        rank: "recruit",
        points: 0
      });
      
      res.json(member);
    } catch (error) {
      console.error("Error joining alliance:", error);
      res.status(500).json({ message: "Failed to join alliance" });
    }
  });
  
  // Leave alliance
  app.post("/api/alliances/:id/leave", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;
      
      await storage.removeAllianceMember(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error leaving alliance:", error);
      res.status(500).json({ message: "Failed to leave alliance" });
    }
  });
  
  // ==== MARKET ROUTES ====
  
  // Get active market orders
  app.get("/api/market/orders", isAuthenticated, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const orders = await storage.getActiveMarketOrders(limit);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching market orders:", error);
      res.status(500).json({ message: "Failed to fetch market orders" });
    }
  });
  
  // Get user's market orders
  app.get("/api/market/my-orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const orders = await storage.getUserMarketOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });
  
  // Create market order
  app.post("/api/market/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const orderData = { ...req.body, userId };
      
      const order = await storage.createMarketOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Error creating market order:", error);
      res.status(500).json({ message: "Failed to create market order" });
    }
  });
  
  // Cancel market order
  app.delete("/api/market/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMarketOrder(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error canceling market order:", error);
      res.status(500).json({ message: "Failed to cancel market order" });
    }
  });
  
  // ==== LEADERBOARD ====
  
  app.get("/api/leaderboard", isAuthenticated, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  return httpServer;
}
