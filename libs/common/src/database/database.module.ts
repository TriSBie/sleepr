import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // useFactory is a function that returns a promise
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.getOrThrow("MYSQL_HOST"),
        port: configService.getOrThrow("MYSQL_PORT"),
        database: configService.getOrThrow("MYSQL_DATABASE"),
        username: configService.getOrThrow("MYSQL_USERNAME"),
        password: configService.getOrThrow("MYSQL_PASSWORD"),
        synchronize: configService.getOrThrow("MYSQL_SYNCHRONIZE") === "true",
        retryDelay: 3000,
        autoLoadEntities: true,
      }),
      inject: [ConfigService], // inject the ConfigService to get the MONGODB_URI from the environment variables
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models); // forFeature is a method that allows you to define models for the current module
  }
}
