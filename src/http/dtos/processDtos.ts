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
