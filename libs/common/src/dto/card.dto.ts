import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string; // Card verification code (CVC) is a 3 or 4 digit number on the back of the card

  @IsNumber()
  exp_month: number; // Card expiration month (1-12)

  @IsNumber()
  exp_year: number; // Card expiration year (4 digits)

  @IsCreditCard()
  number: string; // Card number (16 digits)
}
