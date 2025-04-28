import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Get()
  getUsers() {
    return this.userService.findAll();
  }
}
