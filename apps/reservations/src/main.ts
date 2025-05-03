import { NestFactory } from "@nestjs/core";
import { ReservationsModule } from "./reservations.module";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  ); // Enable validation for incoming requests
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  app.use(cookieParser()); // Use cookie parser middleware to parse cookies in requests
  await app.listen(configService.get("PORT") ?? 3000, () => {
    console.log(
      `Reservations service is running on: http://localhost:${configService.get("PORT") ?? 3000}`,
    );
  });
}
bootstrap();
