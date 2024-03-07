import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import zodErrorHandler from "../utils/zodErrorHandler";

export default function globalExceptionHandler(
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    const errors = zodErrorHandler(error);

    return response.status(422).send({
      statusCode: 422,
      errors,
    });
  }

  if (error instanceof Error) {
    //@ts-ignore
    const status = error.cause?.status ? error.cause.status : 500;

    return response.status(status).send({
      statusCode: status,
      message: error.message ?? "Internal server error.",
    });
  }

  next();
}
