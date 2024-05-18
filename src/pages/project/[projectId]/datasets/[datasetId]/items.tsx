import Header from "@/components/layouts/header";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { DatasetItemsTable } from "@/features/datasets/components/DatasetItemsTable";
import { DetailPageNav } from "@/features/navigate-detail-pages/DetailPageNav";
import { DatasetActionButton } from "@/features/datasets/components/DatasetActionButton";
import { DeleteButton } from "@/components/deleteButton";
import { NewDatasetItemButton } from "@/features/datasets/components/NewDatasetItemButton";
import { JSONView } from "@/components/ui/CodeJsonViewer";
import { FullScreenPage } from "@/components/layouts/full-screen-page";

export default function DatasetItems() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const datasetId = router.query.datasetId as string;
  const utils = api.useUtils();

  const dataset = api.datasets.byId.useQuery({
    datasetId,
    projectId,
  });

  return (
    <FullScreenPage>
      <Header
        title={dataset.data?.name ?? ""}
        help={
          dataset.data?.description
            ? {
                description: dataset.data.description,
              }
            : undefined
        }
        breadcrumb={[
          { name: "Datasets", href: `/project/${projectId}/datasets` },
          {
            name: dataset.data?.name ?? datasetId,
            href: `/project/${projectId}/datasets/${datasetId}`,
          },
          {
            name: "Items",
          },
        ]}
        actionButtons={
          <>
            <NewDatasetItemButton projectId={projectId} datasetId={datasetId} />
            <DetailPageNav
              currentId={datasetId}
              path={(id) => `/project/${projectId}/datasets/${id}/items/`}
              listKey="datasets"
            />
            <DatasetActionButton
              mode="update"
              projectId={projectId}
              datasetId={datasetId}
              datasetName={dataset.data?.name ?? ""}
              datasetDescription={dataset.data?.description ?? undefined}
              datasetMetadata={dataset.data?.metadata}
              icon
            />
            <DeleteButton
              itemId={datasetId}
              projectId={projectId}
              isTableAction={false}
              scope="datasets:CUD"
              invalidateFunc={() => void utils.datasets.invalidate()}
              type="dataset"
              redirectUrl={`/project/${projectId}/datasets`}
            />
          </>
        }
      />

      {!!dataset.data?.metadata && (
        <JSONView json={dataset?.data.metadata} title="Metadata" />
      )}

      <DatasetItemsTable
        projectId={projectId}
        datasetId={datasetId}
        menuItems={
          <Tabs value="items">
            <TabsList>
              <TabsTrigger value="runs" asChild>
                <Link href={`/project/${projectId}/datasets/${datasetId}`}>
                  Runs
                </Link>
              </TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
    </FullScreenPage>
  );
}
