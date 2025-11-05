import { z } from "zod";

export const answerSchema = z.object({
  response: z.union([
    z.string().min(1),
    z.object({
      response: z.string().min(1),
      mainSource: z.string().nullable(),
    }),
  ]),
  mainSource: z.string().nullable().optional(),
});
