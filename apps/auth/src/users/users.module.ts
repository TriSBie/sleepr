import { DatabaseModule } from "@app/common";
import { Module } from "@nestjs/common";

import { UserRepository } from "./user.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Role, User } from "@app/common/models";

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository], // which services, repositories, or helpers should be created and available for this module
  exports: [UsersService], // which services, repositories, or helpers should be available for other modules to use
})
export class UsersModule {}
