import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppError } from "../utils/AppError";

export const validateDto = (dtoClass: any) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error: ValidationError) => {
          if (error.constraints) {
            return Object.values(error.constraints);
          }
          return [];
        })
        .flat();

      return next(new AppError(errorMessages.join(", "), 400));
    }

    req.body = dtoObject;
    next();
  };
};
