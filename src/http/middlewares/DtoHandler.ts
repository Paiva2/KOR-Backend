import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import zodErrorHandler from "../utils/zodErrorHandler";

export const dtoHandler = (zodObject: AnyZodObject) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      zodObject.parse(request.body);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = zodErrorHandler(err);

        return response.status(422).send({
          statusCode: 422,
          errors,
        });
      }
    }
  };
};
