import { type orderBy } from "@/shared";
import { type z } from "zod";

// to be sent to the server
export type OrderByState = z.infer<typeof orderBy>;
