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
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository], // which services, repositories, or helpers should be created and available for this module
})
export class ReservationsModule {}
