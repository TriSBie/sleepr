import { Module } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from "@nestjs/config";

@Module({
  // "Hey module, when I import you, I also want to pass some configuration to set you up!" as forRoot() does
  imports: [
    // using NestConfigModule to load environment variables from .env file
    NestConfigModule.forRoot({
      isGlobal: true, // make the config module global so that it can be used in any module without importing it again
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
