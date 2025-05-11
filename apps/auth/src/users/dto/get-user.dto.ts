import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class GetUserDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => Number)
  _id: number;
}
