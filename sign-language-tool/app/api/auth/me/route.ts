import { NextRequest, NextResponse } from "next/server";
import { databaseService } from "@/services/database";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authorization = request.headers.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    // Initialize database if not already initialized
    await databaseService.initialize();

    // Validate session
    const user = await databaseService.validateSession(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
