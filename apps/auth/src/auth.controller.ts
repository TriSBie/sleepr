import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/curren-user-decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { UserDocument } from "./users/models/users.schema";
import { Response } from "express";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Use LocalAuthGuard to protect this route
  @Post("login")
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response, // passthrough: true allows you to modify the response object without NestJS interfering with it
  ) {
    const jwt = await this.authService.login(user, res); // Generate JWT token for the user
    res.send(jwt); // Send the JWT token back to the client
  }
}
