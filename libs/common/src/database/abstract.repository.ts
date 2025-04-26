import { FilterQuery, Model, Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, "_id">): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(), // Generate a new ObjectId if _id is not provided
    });

    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    // using lean() to get a plain JavaScript object instead of a Mongoose document
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      return null;
    }

    return document as TDocument;
  }
}
