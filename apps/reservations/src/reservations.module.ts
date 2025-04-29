import { DatabaseModule } from "@app/common";
import { Module } from "@nestjs/common";
import {
  ReservationDocument,
  ReservationSchema,
} from "./models/reservations.schema";
import { ReservationsController } from "./reservations.controller";
import { ReservationsRepository } from "./reservations.repository";
import { ReservationsService } from "./reservations.service";
import { LoggerModule } from "@app/common/logger";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: ReservationDocument.name,
        schema: ReservationSchema,
      },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true, // make the environment variables available globally
      envFilePath: "./apps/reservations/.env", // load environment variables from .env file
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(), // MONGODB_URI is required
        PORT: Joi.number().required(), // required to 3000
      }),
    }), // forRoot is a method that allows you to load environment variables from a .env file
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository], // which services, repositories, or helpers should be created and available for this module
})
export class ReservationsModule {}
