import z from "zod";

const cnpjRegex =
  /^(?:(?:(?:\d{2}\.){2}\d{3}\/\d{4}-\d{2})|(?:(?:\d{2}\/){2}\d{4}-\d{2})|\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;

export const clientRegisterDTO = z.object({
  cnpj: z.string().regex(cnpjRegex, { message: "invalid CNPJ format." }),
  name: z.string().min(3, { message: "name must have at least 3 characters." }),
});
