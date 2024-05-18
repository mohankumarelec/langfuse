import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "@/env.mjs";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export const config = {
  maxDuration: 240,
};

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  // batching: {
  //   enabled: false,
  // },
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
