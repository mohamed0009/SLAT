import { NextResponse } from "next/server";
import { databaseService } from "@/services/database";
import { authService } from "@/services/auth";

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token and check if user is admin
    const payload = await authService.verifyToken(token);
    if (payload.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Initialize database
    await databaseService.initialize();

    // Get all users
    const users = await databaseService.getAllUsers();

    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      totalAdmins: users.filter((user) => user.role === "admin").length,
      totalClients: users.filter((user) => user.role === "client").length,
      activeUsers: users.length, // Placeholder for active users count
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching admin statistics" },
      { status: 500 }
    );
  }
}
