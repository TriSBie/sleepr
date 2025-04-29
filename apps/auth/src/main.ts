import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { Logger } from "nestjs-pino";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  ); // Enable validation for incoming requests
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT") ?? 3001, () => {
    console.log(`Auth service is running on: ${process.env.port ?? 3001}`);
  });
}
bootstrap();
