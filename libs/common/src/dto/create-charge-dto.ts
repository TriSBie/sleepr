import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { CardDto } from "./card.dto";
import { Type } from "class-transformer";

export class CreateChargeDto {
  @IsDefined() // This field is required
  @IsNotEmptyObject() // This field cannot be an empty object
  @ValidateNested() // This field must be a nested object
  @Type(() => CardDto) // This field must be of type CardDto
  card: CardDto; // Card information

  @IsNumber()
  amount: number; // Amount to be charged in cents (e.g., $10.00 = 1000 cents)
}
