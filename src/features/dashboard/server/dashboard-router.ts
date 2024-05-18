import { z } from "zod";

import {
  createTRPCRouter,
  protectedProjectProcedure,
} from "@/server/api/trpc";
import { executeQuery } from "@/server/api/services/query-builder";
import {
  filterInterface,
  sqlInterface,
} from "@/server/api/services/sqlInterface";

export const dashboardRouter = createTRPCRouter({
  chart: protectedProjectProcedure
    .input(
      sqlInterface.extend({
        projectId: z.string(),
        filter: filterInterface.optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await executeQuery(ctx.prisma, input.projectId, input);
    }),
});
