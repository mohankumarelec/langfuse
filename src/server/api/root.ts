import { createTRPCRouter } from "@/server/api/trpc";
import { traceRouter } from "./routers/traces";
import { generationsRouter } from "./routers/generations";
import { scoresRouter } from "./routers/scores";
import { dashboardRouter } from "@/features/dashboard/server/dashboard-router";
import { projectsRouter } from "@/features/projects/server/projectsRouter";
import { apiKeysRouter } from "@/features/public-api/server/apiKeyRouter";
import { projectMembersRouter } from "@/features/rbac/server/projectMembersRouter";
import { userRouter } from "@/server/api/routers/users";
import { datasetRouter } from "@/features/datasets/server/dataset-router";
import { observationsRouter } from "@/server/api/routers/observations";
import { sessionRouter } from "@/server/api/routers/sessions";
import { promptRouter } from "@/features/prompts/server/routers/promptRouter";
import { modelRouter } from "@/server/api/routers/models";
import { posthogIntegrationRouter } from "@/features/posthog-integration/posthog-integration-router";
import { llmApiKeyRouter } from "@/features/llm-api-key/server/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  traces: traceRouter,
  sessions: sessionRouter,
  generations: generationsRouter,
  scores: scoresRouter,
  dashboard: dashboardRouter,
  projects: projectsRouter,
  users: userRouter,
  apiKeys: apiKeysRouter,
  projectMembers: projectMembersRouter,
  datasets: datasetRouter,
  observations: observationsRouter,
  prompts: promptRouter,
  models: modelRouter,
  posthogIntegration: posthogIntegrationRouter,
  llmApiKey: llmApiKeyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
