import { NestFactory } from "@nestjs/core";
import { NotificationsModule } from "./notifications.module";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ, // Use RMQ transport
    options: {
      urls: [configService.get("RABBITMQ_URI")], // RabbitMQ URI from environment variables
      queue: "notifications",
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
