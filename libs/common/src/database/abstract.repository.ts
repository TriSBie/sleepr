import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  // The model is a Mongoose model that represents the collection in the database
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, "_id">): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(), // Generate a new ObjectId if _id is not provided
    });

    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    // using lean() to get a plain JavaScript object instead of a Mongoose document
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
    }

    return document as TDocument;
  }

  async update(
    filterQuery: FilterQuery<TDocument>,
    update: Partial<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
    }

    return document as TDocument;
  }
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true,
    });
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
    }
    return document as TDocument;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model.findOneAndDelete(filterQuery);
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
    }
    return document as TDocument;
  }
}
