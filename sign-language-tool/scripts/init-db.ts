import { databaseService } from "@/services/database";
import fs from "fs";
import path from "path";

async function initializeDatabase() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    console.log("Creating data directory at:", dataDir);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("Data directory created");
    } else {
      console.log("Data directory already exists");
    }

    console.log("Initializing database...");
    await databaseService.initialize();
    console.log("Database initialized successfully");

    // Create default admin user if it doesn't exist
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    try {
      await databaseService.createUser(adminEmail, adminPassword, "admin");
      console.log("Default admin user created successfully");
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        console.log("Default admin user already exists");
      } else {
        console.error("Error creating admin user:", error);
        throw error;
      }
    }

    console.log("Database initialization completed");

    // Verify database file exists
    const dbPath = path.join(dataDir, "sign_language.db");
    if (fs.existsSync(dbPath)) {
      console.log("Database file created successfully at:", dbPath);
    } else {
      throw new Error("Database file was not created at: " + dbPath);
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

initializeDatabase();
