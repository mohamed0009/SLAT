import { NextResponse } from "next/server";
import { databaseService } from "@/services/database";
import { authService } from "@/services/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Initialize database
    console.log("Initializing database...");
    await databaseService.initialize();
    console.log("Database initialized successfully");

    // Get user by email
    console.log("Fetching user by email...");
    const user = await databaseService.getUserByEmail(email);
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    console.log("Comparing passwords...");
    const isPasswordValid = await databaseService.comparePasswords(
      password,
      user.password
    );
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create token
    console.log("Creating token...");
    const token = await authService.createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    console.log("Token created successfully");

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
