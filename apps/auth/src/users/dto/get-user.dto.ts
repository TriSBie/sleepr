import { IsString } from "class-validator";

export class GetUserDTO {
  @IsString()
  _id: string;
}
