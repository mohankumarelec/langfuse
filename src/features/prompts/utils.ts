import {
  LATEST_PROMPT_LABEL,
  PRODUCTION_LABEL,
} from "@/features/prompts/constants";

export const isReservedPromptLabel = (label: string) => {
  return [PRODUCTION_LABEL, LATEST_PROMPT_LABEL].includes(label);
};
