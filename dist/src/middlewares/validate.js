"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const AppError_1 = require("../utils/AppError");
const validateDto = (dtoClass) => {
    return async (req, _, next) => {
        const dtoObject = (0, class_transformer_1.plainToClass)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dtoObject);
        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => {
                if (error.constraints) {
                    return Object.values(error.constraints);
                }
                return [];
            })
                .flat();
            return next(new AppError_1.AppError(errorMessages.join(", "), 400));
        }
        req.body = dtoObject;
        next();
    };
};
exports.validateDto = validateDto;
//# sourceMappingURL=validate.js.map