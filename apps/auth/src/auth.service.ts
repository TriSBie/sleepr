import { Injectable } from "@nestjs/common";
import { UserDocument } from "../../../libs/common/src/models/users.schema";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./interfaces/token-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id,
    };

    const JWT_EXPIRATION = this.configService.get("JWT_EXPIRATION") as number;

    const expired = new Date();
    expired.setSeconds(expired.getSeconds() + JWT_EXPIRATION); // 1 hour expiration

    const token = this.jwtService.sign(tokenPayload);

    response.cookie("Authentication", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      expires: expired,
    });

    return token;
  }
}
