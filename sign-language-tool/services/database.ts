import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";
import fs from "fs";

export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "client";
  created_at: Date;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private db: any;
  private isInitialized = false;
  private connectionError: Error | null = null;
  private dbPath: string;

  private constructor() {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.dbPath = path.join(dataDir, "sign_language.db");
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.error(`Operation failed (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt < maxRetries) {
          console.log(`Retrying operation... (${maxRetries - attempt} attempts remaining)`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    throw new AggregateError([lastError], "Operation failed after multiple attempts");
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Open SQLite database
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      // Enable foreign keys
      await this.db.run("PRAGMA foreign_keys = ON");

      // Create users table if it doesn't exist
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Check if admin user exists
      const adminExists = await this.db.get(
        "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
      );

      // Create default admin user if none exists
      if (adminExists.count === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await this.db.run(
          `INSERT INTO users (id, email, password, role) 
           VALUES (?, ?, ?, ?)`,
          ["admin", "admin@example.com", hashedPassword, "admin"]
        );
        console.log("Default admin user created");
      }

      this.isInitialized = true;
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      this.connectionError = error as Error;
      throw new Error(
        `Database initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async createUser(email: string, password: string, role: "admin" | "client" = "client"): Promise<User> {
    await this.initialize();

    // Check if user already exists
    const existingUser = await this.db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique ID
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Insert new user
    await this.db.run(
      `INSERT INTO users (id, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [id, email, hashedPassword, role]
    );

    // Return user without password
    const user = await this.db.get(
      "SELECT id, email, role, created_at FROM users WHERE id = ?",
      [id]
    );

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.initialize();
    return await this.db.get("SELECT * FROM users WHERE email = ?", [email]);
  }

  async getUserById(id: string): Promise<User | null> {
    await this.initialize();
    return await this.db.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  async getAllUsers(): Promise<User[]> {
    await this.initialize();
    return await this.db.all("SELECT id, email, role, created_at FROM users");
  }

  async updateUserRole(id: string, role: "admin" | "client"): Promise<void> {
    await this.initialize();
    await this.db.run("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  }

  async deleteUser(id: string): Promise<void> {
    await this.initialize();
    await this.db.run("DELETE FROM users WHERE id = ?", [id]);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async validateSession(token: string): Promise<User | null> {
    await this.initialize();
    
    try {
      // This is a simple implementation. In a real app, you would:
      // 1. Check a sessions table where tokens are stored
      // 2. Verify token expiration
      // 3. Return the associated user
      
      // For now, we'll assume the token is a user ID for simplicity
      const user = await this.getUserById(token);
      return user;
    } catch (error) {
      console.error("Session validation failed:", error);
      return null;
    }
  }
}

export const databaseService = DatabaseService.getInstance();
