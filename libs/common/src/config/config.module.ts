import { Module } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from "@nestjs/config";

import * as Joi from "joi"; // Joi is a validation library for JavaScript and TypeScript

@Module({
  // "Hey module, when I import you, I also want to pass some configuration to set you up!" as forRoot() does
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // make the config module global so that it can be used in any module without importing it again
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
