import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUser: CreateUserDto) {
    return this.userRepository.create(createUser);
  }

  async findAll() {
    return this.userRepository.find({});
  }
}
