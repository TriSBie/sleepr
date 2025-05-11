import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractEntity } from "./abstract.entity";
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class AbstractRepository<
  TDocument extends AbstractEntity<TDocument>,
> {
  protected abstract readonly logger: Logger;

  // The model is a TypeORM repository that represents the collection in the database
  constructor(
    private readonly entity: Repository<TDocument>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: TDocument): Promise<TDocument> {
    // entity save is a TypeORM method that saves the entity to the database
    return await this.entity.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<TDocument>,
    relations?: FindOptionsRelations<TDocument>,
  ): Promise<TDocument | null> {
    const entity = await this.entity.findOne({
      where,
      relations,
    });
    if (!entity) {
      this.logger.warn("Document not found with where", where);
      throw new NotFoundException("Entity not found.");
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<TDocument>,
    partialEntity: QueryDeepPartialEntity<TDocument>,
  ): Promise<TDocument | null> {
    const updateResult = await this.entity.update(where, partialEntity);

    if (!updateResult.affected) {
      this.logger.warn("Entity not found with where", where);
      throw new NotFoundException("Entity not found.");
    }

    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<TDocument>): Promise<TDocument[]> {
    return await this.entity.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<TDocument>) {
    await this.entity.delete(where);
  }
}
