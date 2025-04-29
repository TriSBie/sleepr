import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUser: CreateUserDto) {
    return this.userRepository.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10), // hash the password before saving it
    });
  }

  async findAll() {
    return this.userRepository.find({});
  }

  async verifyUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user.password); // compare the password with the hashed password
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credentials is not valid"); // password is invalid
    }
    return user; // user found and password is valid
  }
}
