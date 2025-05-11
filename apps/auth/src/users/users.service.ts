import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDTO } from "./dto/get-user.dto";
import { UserRepository } from "./user.repository";
import { Role, User } from "@app/common/models";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validCreateUserDTO(createUserDto); // validate the user DTO
    const newUser = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10), // hash the password before saving it
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
    });

    return this.userRepository.create(newUser); // create the user
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
    const isPasswordValid = await bcrypt.compare(password, user!.password); // compare the password with the hashed password
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credentials is not valid"); // password is invalid
    }
    return user; // user found and password is valid
  }

  async getUser(getUserDTO: GetUserDTO) {
    const { _id } = getUserDTO;
    return this.userRepository.findOne(
      {
        id: _id,
      },
      {
        roles: true,
      },
    );
  }
}
