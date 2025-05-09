import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDTO } from "./dto/get-user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUser: CreateUserDto) {
    await this.validCreateUserDTO(createUser); // validate the user DTO
    return this.userRepository.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10), // hash the password before saving it
    });
  }

  private async validCreateUserDTO(createUserDTO: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDTO.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException("User already exists"); // user already exists
  }
  async findAll() {
    return this.userRepository.find({});
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email }); // find user by email
    const isPasswordValid = await bcrypt.compare(password, user.password); // compare the password with the hashed password
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credentials is not valid"); // password is invalid
    }
    return user; // user found and password is valid
  }

  async findOne(getUserDTO: GetUserDTO) {
    const { _id } = getUserDTO;
    return this.userRepository.findOne({
      _id,
    });
  }

  async delete(_id: string) {
    return this.userRepository.findOneAndDelete({ _id }); // delete the user
  }

  async update(_id: string, updateUserDto: CreateUserDto) {
    await this.validCreateUserDTO(updateUserDto); // validate the user DTO
    return this.userRepository.findOneAndUpdate(
      { _id },
      {
        ...updateUserDto,
        password: await bcrypt.hash(updateUserDto.password, 10), // hash the password before saving it
      },
    );
  }
}
