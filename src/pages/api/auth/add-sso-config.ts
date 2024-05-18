/**
 * This endpoint is used to add a new SSO configuration to the database.
 *
 * This is an EE feature and will return a 404 response if EE is not available.
 */

import { type NextApiRequest, type NextApiResponse } from "next";

export default async function createNewSsoConfigHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(403).json({ error: "EE is not available" });
  return;
}
