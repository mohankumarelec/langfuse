import type { NextApiRequest, NextApiResponse } from "next";

import { getPromptByName } from "@/features/prompts/server/actions/getPromptByName";
import { GetPromptByNameSchema } from "@/features/prompts/server/utils/validation";
import { withMiddlewares } from "@/server/utils/withMiddlewares";

import { authorizePromptRequestOrThrow } from "../utils/authorizePromptRequest";

const getPromptNameHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const authCheck = await authorizePromptRequestOrThrow(req);
  const { promptName, version, label } = GetPromptByNameSchema.parse(req.query);

  const prompt = await getPromptByName({
    promptName: promptName,
    projectId: authCheck.scope.projectId,
    version,
    label,
  });

  return res.status(200).json(prompt);
};

export const promptNameHandler = withMiddlewares({ GET: getPromptNameHandler });
