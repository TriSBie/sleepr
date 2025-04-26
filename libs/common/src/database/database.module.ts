import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      // useFactory is a function that returns a promise
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("MONGODB_URI"),
      }),
      inject: [ConfigService], // inject the ConfigService to get the MONGODB_URI from the environment variables
    }),
  ],
})
export class DatabaseModule {}
