import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { LoggerModule } from "@app/common/logger";
import { DatabaseModule } from "@app/common";
import { UserDocument, UserSchema } from "./models/users.schema";
import { UserRepository } from "./user.repository";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository], // which services, repositories, or helpers should be created and available for this module
  exports: [UsersService], // which services, repositories, or helpers should be available for other modules to use
})
export class UsersModule {}
