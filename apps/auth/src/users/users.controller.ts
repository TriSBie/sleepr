import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../decorators/curren-user-decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDocument } from "./models/users.schema";
import { UsersService } from "./users.service";
import { JwtAuthGuards } from "../guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @UseGuards(JwtAuthGuards)
  @Get("me")
  getUsers(@CurrentUser() user: UserDocument) {
    return user;
  }
}
