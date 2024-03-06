import z from "zod";

export const insertProcessParticipantDTO = z.object({
  processId: z
    .string()
    .uuid({ message: "processId precisa ser um id válido." }),
  participantId: z
    .string()
    .uuid({ message: "participantId precisa ser um uuid válido." }),
});
