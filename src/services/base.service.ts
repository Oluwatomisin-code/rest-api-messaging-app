import { Document, Types } from "mongoose";
import { AppError } from "../utils/AppError";

export class BaseService<T extends Document> {
  constructor(protected model: any) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = new this.model(data);
      return await entity.save();
    } catch (error) {
      console.error("Base service create error:", error);
      throw new AppError(error.message || "Error creating entity", 400);
    }
  }

  async findById(id: string): Promise<T> {
    const entity = await this.model.findById(new Types.ObjectId(id));
    if (!entity) {
      throw new AppError("Entity not found", 404);
    }
    return entity;
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.model.findByIdAndUpdate(
      new Types.ObjectId(id),
      data,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!entity) {
      throw new AppError("Entity not found", 404);
    }
    return entity;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.model.findByIdAndDelete(new Types.ObjectId(id));
    if (!entity) {
      throw new AppError("Entity not found", 404);
    }
  }
}
