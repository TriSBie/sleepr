import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../decorators/current-user-decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuards } from "../guards/jwt-auth.guard";
import { Roles } from "../decorators";
import { User } from "@app/common/models";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuards)
  @Get("me")
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }
}
