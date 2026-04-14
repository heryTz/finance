import { z } from "zod/v4";

export const createUserInputSchema = z.object({
  email: z.email(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
