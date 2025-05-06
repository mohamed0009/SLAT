import { jwtVerify, SignJWT } from "jose";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  private static instance: AuthService;
  private secret: Uint8Array;

  private constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set. Using a default secret for development.");
      // Use a default secret in development mode
      if (process.env.NODE_ENV === "development") {
        this.secret = new TextEncoder().encode("development-secret-key");
      } else {
        throw new Error("JWT_SECRET environment variable is required in production");
      }
    } else {
      this.secret = new TextEncoder().encode(jwtSecret);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      return payload as TokenPayload;
    } catch (error) {
      console.error("Token verification error:", error);
      throw new Error("Invalid or expired token");
    }
  }

  async createToken(payload: TokenPayload): Promise<string> {
    try {
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(this.secret);
    } catch (error) {
      console.error("Token creation error:", error);
      throw new Error("Failed to create token");
    }
  }
}

export const authService = AuthService.getInstance();
