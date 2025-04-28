import { NestFactory } from "@nestjs/core";
import { ReservationsModule } from "./reservations.module";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  ); // Enable validation for incoming requests
  app.useLogger(app.get(Logger));
  await app.listen(process.env.port ?? 3000, () => {
    console.log(
      `Reservations service is running on: http://localhost:${process.env.port ?? 3000}`,
    );
  });
}
bootstrap();
