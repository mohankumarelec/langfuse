import { type NextApiRequest, type NextApiResponse } from "next";

import { createPrompt } from "@/features/prompts/server/actions/createPrompt";
import { getPromptsMeta } from "@/features/prompts/server/actions/getPromptsMeta";
import {
  CreatePromptSchema,
  GetPromptsMetaSchema,
} from "@/features/prompts/server/utils/validation";
import { withMiddlewares } from "@/server/utils/withMiddlewares";
import { prisma } from "@/shared/db";

import { authorizePromptRequestOrThrow } from "../utils/authorizePromptRequest";

const getPromptsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authCheck = await authorizePromptRequestOrThrow(req);

  const input = GetPromptsMetaSchema.parse(req.query);
  const promptsMetadata = await getPromptsMeta({
    ...input,
    projectId: authCheck.scope.projectId,
  });

  return res.status(200).json(promptsMetadata);
};

const postPromptsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const authCheck = await authorizePromptRequestOrThrow(req);

  const input = CreatePromptSchema.parse(req.body);
  const createdPrompt = await createPrompt({
    ...input,
    config: input.config ?? {},
    projectId: authCheck.scope.projectId,
    createdBy: "API",
    prisma: prisma,
  });

  return res.status(201).json(createdPrompt);
};

export const promptsHandler = withMiddlewares({
  GET: getPromptsHandler,
  POST: postPromptsHandler,
});
