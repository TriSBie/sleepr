import { CreateChargeDto } from "@app/common";
import { Type } from "class-transformer";
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsDefined() // This field is required
  @IsNotEmptyObject() // This field cannot be an empty object
  @ValidateNested() // This field must be a nested object
  charge: CreateChargeDto;
}
