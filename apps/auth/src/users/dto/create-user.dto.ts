import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from "class-validator";
import { RoleDto } from "./role-dto";
import { Type } from "class-transformer";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested() // Validate each role in the array
  @Type(() => RoleDto) // Transform each role to RoleDto
  roles?: RoleDto[];
}
