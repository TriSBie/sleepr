import { Injectable } from "@nestjs/common";
import { UserDocument } from "./users/models/users.schema";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id,
    };

    const JWT_EXPIRATION = this.configService.get("JWT_EXPIRATION") as number;
    const expired = new Date();
    expired.setSeconds(expired.getSeconds() + JWT_EXPIRATION); // 1 hour expiration

    const token = this.jwtService.sign(tokenPayload);

    response.cookie("Authentication", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: this.configService.get("NODE_ENV") === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks - CSRF is a type of attack where a malicious website tricks the user's browser into making requests to another site where the user is authenticated.
      expires: expired,
    });

    return token;
  }
}
