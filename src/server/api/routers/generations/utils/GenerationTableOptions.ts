import { z } from "zod";
import { singleFilter } from "@/shared";
import { orderBy } from "@/shared";

export const GenerationTableOptions = z.object({
  projectId: z.string(), // Required for protectedProjectProcedure
  filter: z.array(singleFilter),
  searchQuery: z.string().nullable(),
  orderBy: orderBy,
});
