import { useRouter } from "next/router";
import { TracePage } from "@/components/trace";

export default function Trace() {
  const router = useRouter();
  const traceId = router.query.traceId as string;

  return <TracePage traceId={traceId} />;
}
