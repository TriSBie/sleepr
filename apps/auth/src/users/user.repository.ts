import { AbstractRepository } from "@app/common";
import { User } from "@app/common/models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger: Logger = new Logger(UserRepository.name); // Logger for this repository

  constructor(
    @InjectRepository(User) userRepo: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(userRepo, entityManager);
  }
}
