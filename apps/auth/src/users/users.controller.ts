import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../decorators/current-user-decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDocument } from "../../../../libs/common/src/models/users.schema";
import { UsersService } from "./users.service";
import { JwtAuthGuards } from "../guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuards)
  @Get("me")
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuards)
  async deleteUser(@CurrentUser() user: UserDocument) {
    return this.userService.delete(user._id);
  }
}
