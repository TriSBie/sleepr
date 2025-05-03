import { LoggerModule } from "@app/common/logger";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import * as Joi from "joi"; // Joi is a validation library for JavaScript and TypeScript
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt-strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // import ConfigModule to use ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_EXPIRATION")}s`,
        },
      }),
      // "If I write something inside () of the function, I must also inject it explicitly!"
      inject: [ConfigService], // inject ConfigService to access environment variables
    }),
    ConfigModule.forRoot({
      isGlobal: true, // make the environment variables available globally
      envFilePath: "./apps/auth/.env", // load environment variables from .env file
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(), // JWT_SECRET is required
        JWT_EXPIRATION: Joi.number().default(3600), // default to 1 hour
        TCP_PORT: Joi.number().required(), // required to xxxx\
        HTTP_PORT: Joi.number().required(), // required to xxxx
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy], // placed to stored the injectable class
})
export class AuthModule {}
