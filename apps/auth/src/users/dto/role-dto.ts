import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RoleDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional() // Optional field
  @IsString() // Ensure it's a string
  @IsNotEmpty() // Ensure it's not empty
  name?: string;
}
