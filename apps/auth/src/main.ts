import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { Logger } from "nestjs-pino";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP, // Use TCP transport
    options: {
      host: "0.0.0.0", // Listen on all interfaces
      port: configService.get("TCP_PORT"), // Port for the microservice
    },
  });
  app.use(cookieParser()); // Use cookie parser middleware to parse cookies in requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  ); // Enable validation for incoming requests
  app.useLogger(app.get(Logger));
  // ✅ Start microservices before starting HTTP app
  await app.startAllMicroservices();
  await app.listen(configService.get("HTTP_PORT") ?? 3001, () => {
    console.log(`Auth service is running on: ${process.env.port ?? 3001}`);
  });
}

bootstrap();
