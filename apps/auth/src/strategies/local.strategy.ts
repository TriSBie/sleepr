import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: "email" }); // use email as the username field
  }

  async validate(username: string, password: string) {
    try {
      const user = await this.userService.verifyUser(username, password);
      if (!user) {
        throw new UnauthorizedException("Invalid credentials"); // throw exception if user not found
      }
      // Passport will automatically attach the user object to the request object
      return user;
    } catch (error) {
      throw new UnauthorizedException(error); // throw exception if user not found
    }
  }
}
