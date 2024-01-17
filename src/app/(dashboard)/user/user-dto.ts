import { z } from "zod";

export const createUserInputSchema = z.object({
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
