"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = require("../utils/AppError");
class BaseService {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const entity = new this.model(data);
            return await entity.save();
        }
        catch (error) {
            console.error("Base service create error:", error);
            throw new AppError_1.AppError(error.message || "Error creating entity", 400);
        }
    }
    async findById(id) {
        const entity = await this.model.findById(new mongoose_1.Types.ObjectId(id));
        if (!entity) {
            throw new AppError_1.AppError("Entity not found", 404);
        }
        return entity;
    }
    async findAll() {
        return await this.model.find();
    }
    async update(id, data) {
        const entity = await this.model.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), data, {
            new: true,
            runValidators: true,
        });
        if (!entity) {
            throw new AppError_1.AppError("Entity not found", 404);
        }
        return entity;
    }
    async delete(id) {
        const entity = await this.model.findByIdAndDelete(new mongoose_1.Types.ObjectId(id));
        if (!entity) {
            throw new AppError_1.AppError("Entity not found", 404);
        }
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map