import z from "zod";

export const createProcessDTO = z.object({
  number: z.string(),
  causeValue: z.string(),
  type: z.enum(["administrative", "judicial"], {
    invalid_type_error:
      "type precisa ser do tipo 'administrative' ou 'judicial'",
  }),
  quoteDate: z.string().datetime(),
  audienceDate: z.string().datetime(),
  forum: z.string(),
  city: z.string(),
  state: z.string(),
});

export const updateProcessDTO = z.object({
  causeValue: z.string().optional(),
  type: z
    .enum(["administrative", "judicial"], {
      invalid_type_error:
        "type precisa ser do tipo 'administrative' ou 'judicial'",
    })
    .optional(),
  quoteDate: z.string().datetime().optional(),
  audienceDate: z.string().datetime().optional(),
  forum: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const listAllProcessDTO = z.object({
  page: z.string({ required_error: "page não pode ser vazio." }),
  perPage: z.string({ required_error: "perPage não pode ser vazio." }),
  cliente: z
    .string()
    .uuid({ message: "cliente precisa ser um uuid válido." })
    .optional(),
  participante: z
    .string()
    .uuid({ message: "participante precisa ser um uuid válido." })
    .optional(),
});
