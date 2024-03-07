import { ZodError, fromZodError } from "zod-validation-error";

export default function zodErrorHandler(err: ZodError): string[] {
  const validationError = fromZodError(err);

  const errors = validationError.details.map((error) => error.message);

  return errors;
}
