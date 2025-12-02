import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import crypto from "crypto";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use in-memory session store to avoid database connection issues
  const SessionStore = MemoryStore(session);
  const sessionStore = new SessionStore({
    checkPeriod: 86400000, // Check for expired sessions every day
  });
  
  const isDevelopment = process.env.NODE_ENV === "development";
  
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: !isDevelopment, // Only secure in production (HTTPS)
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const passwordHash = hashPassword(password);
      const user = await storage.createUser({
        username,
        passwordHash,
        email: `${username}@stellar.local`,
        firstName: username,
      });

      (req.session as any).userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session creation failed" });
        }
        res.json({ message: "Account created", user });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("[SERVER-AUTH] Login attempt:", { username, password: "***" });

      if (!username || !password) {
        console.warn("[SERVER-AUTH] Missing credentials");
        return res.status(400).json({ message: "Username and password required" });
      }

      console.log("[SERVER-AUTH] Looking up user:", username);
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        console.warn("[SERVER-AUTH] User not found:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!user.passwordHash) {
        console.warn("[SERVER-AUTH] User has no password hash:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("[SERVER-AUTH] Verifying password for user:", username);
      const passwordValid = verifyPassword(password, user.passwordHash);
      console.log("[SERVER-AUTH] Password verification result:", passwordValid);
      
      if (!passwordValid) {
        console.warn("[SERVER-AUTH] Invalid password for user:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("[SERVER-AUTH] Login successful for user:", username, "User ID:", user.id);
      (req.session as any).userId = user.id;
      
      req.session.save((err) => {
        if (err) {
          console.error("[SERVER-AUTH] Session save error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        console.log("[SERVER-AUTH] Session saved successfully for user:", username);
        res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName } });
      });
    } catch (error) {
      console.error("[SERVER-AUTH] Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
