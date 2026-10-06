import { z } from "zod";

export const generateAiReportSchema = z.object({
  month: z.string().regex(/^(0?[1-9]|1[0-2])$/, {
    message: "Month must be between 1 and 12",
  }),
});

export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;
