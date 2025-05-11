import { NestFactory } from "@nestjs/core";
import { PaymentsModule } from "./payments.module";
import { Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ, // Use RMQ transport
    options: {
      urls: [configService.get("RABBITMQ_URI")], // RabbitMQ URI from environment variables
      queue: "payments",
      noAck: false, // Set to true if you want to manually acknowledge messages
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
