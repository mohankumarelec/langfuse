import Header from "@/components/layouts/header";
import { ApiKeyList } from "@/features/public-api/components/ApiKeyList";
import { useRouter } from "next/router";
import { ProjectMembersTable } from "@/features/rbac/components/ProjectMembersTable";
import { DeleteProjectButton } from "@/features/projects/components/DeleteProjectButton";
import { HostNameProject } from "@/features/projects/components/HostNameProject";
import { TransferOwnershipButton } from "@/features/projects/components/TransferOwnershipButton";
import RenameProject from "@/features/projects/components/RenameProject";
import { LlmApiKeyList } from "@/features/public-api/components/LLMApiKeyList";

export default function SettingsPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  return (
    <div className="md:container">
      <Header title="Settings" />
      <div className="flex flex-col gap-10">
        <HostNameProject />
        <ApiKeyList projectId={projectId} />
        <LlmApiKeyList projectId={projectId} />
        <ProjectMembersTable projectId={projectId} />
        <RenameProject projectId={projectId} />
        <div className="space-y-3">
          <DeleteProjectButton projectId={projectId} />
          <TransferOwnershipButton projectId={projectId} />
        </div>
      </div>
    </div>
  );
}

