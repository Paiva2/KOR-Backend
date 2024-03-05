import z from "zod";

const phoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;

export const registerParticipant = z.object({
  name: z.string(),
  email: z.string().email({ message: "E-mail inválido." }),
  phone: z.string().regex(phoneRegex, { message: "Telefone inválido." }),
  document: z.string(),
  type: z.enum(["lawyer", "defendant"]),
});
