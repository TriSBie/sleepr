import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Reservation } from "./models/reservations.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectRepository(Reservation) itemsRepository: Repository<Reservation>,
    entityManager: EntityManager, // EntityManager is a powerful class that allows you to interact with your database in a low-level, flexible way
  ) {
    super(itemsRepository, entityManager);
  }
}

/**
 * EntityManager: Manage any entity (read, write, delete, update)
 * This class provides methods to perform operations on entities in the database.
 * It is essential for handling transactions and executing complex queries.
 * It can also be used to create custom queries and manage relationships between entities.
 * This class is crucial for ensuring data integrity and optimizing performance in database operations.
 */
