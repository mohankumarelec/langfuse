import { useRouter } from "next/router";
import { SessionPage } from "@/components/session";

export default function Trace() {
  const router = useRouter();
  const sessionId = decodeURIComponent(router.query.sessionId as string);
  const projectId = router.query.projectId as string;

  return <SessionPage sessionId={sessionId} projectId={projectId} />;
}
