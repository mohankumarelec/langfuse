import Header from "@/components/layouts/header";
import { findClosestInterval } from "@/features/dashboard/lib/timeseries-aggregation";
import { useRouter } from "next/router";
import { GenerationLatencyChart } from "@/features/dashboard/components/LatencyChart";
import { ChartScores } from "@/features/dashboard/components/ChartScores";
import { TracesBarListChart } from "@/features/dashboard/components/TracesBarListChart";
import { MetricTable } from "@/features/dashboard/components/MetricTable";
import { ScoresTable } from "@/features/dashboard/components/ScoresTable";
import { ModelUsageChart } from "@/features/dashboard/components/ModelUsageChart";
import { TracesTimeSeriesChart } from "@/features/dashboard/components/TracesTimeSeriesChart";
import { UserChart } from "@/features/dashboard/components/UserChart";
import {
  type AvailableDateRangeSelections,
  DEFAULT_DATE_RANGE_SELECTION,
  DatePickerWithRange,
} from "@/components/date-picker";
import { addDays } from "date-fns";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { isValidOption } from "@/utils/types";
import { api } from "@/utils/api";
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopoverFilterBuilder } from "@/features/filters/components/filter-builder";
import { type FilterState } from "@/shared";
import { type ColumnDefinition } from "@/shared";
import { useQueryFilterState } from "@/features/filters/hooks/useFilterState";
import { LatencyTables } from "@/features/dashboard/components/LatencyTables";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePostHogClientCapture } from "@/features/posthog-analytics/usePostHogClientCapture";

export type DashboardDateRange = {
  from: Date;
  to: Date;
};

export default function Start() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const capture = usePostHogClientCapture();

  const session = useSession();
  const disableExpensiveDashboardComponents =
    session.data?.environment.disableExpensivePostgresQueries ?? true;
  const project = session.data?.user?.projects.find(
    (project) => project.id === projectId,
  );

  const memoizedDate = useMemo(() => new Date(), []);

  const [urlParams, setUrlParams] = useQueryParams({
    from: withDefault(NumberParam, addDays(memoizedDate, -7).getTime()),
    to: withDefault(NumberParam, memoizedDate.getTime()),
    select: withDefault(StringParam, "Select a date range"),
  });

  const dateRange = useMemo(
    () =>
      urlParams.from && urlParams.to
        ? { from: new Date(urlParams.from), to: new Date(urlParams.to) }
        : undefined,
    [urlParams.from, urlParams.to],
  );

  const selectedOption = isValidOption(urlParams.select)
    ? urlParams.select
    : DEFAULT_DATE_RANGE_SELECTION;

  const setDateRangeAndOption = (
    option?: AvailableDateRangeSelections,
    dateRange?: DashboardDateRange,
  ) => {
    capture("dashboard:date_range_changed");
    setUrlParams({
      select: option ? option.toString() : urlParams.select,
      from: dateRange ? dateRange.from.getTime() : urlParams.from,
      to: dateRange ? dateRange.to.getTime() : urlParams.to,
    });
  };

  const traceFilterOptions = api.traces.filterOptions.useQuery(
    {
      projectId,
    },
    {
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );
  const nameOptions = traceFilterOptions.data?.name || [];
  const tagsOptions = traceFilterOptions.data?.tags || [];

  const filterColumns: ColumnDefinition[] = [
    {
      name: "Trace Name",
      id: "traceName",
      type: "stringOptions",
      options: nameOptions,
      internal: "internalValue",
    },
    {
      name: "Tags",
      id: "tags",
      type: "arrayOptions",
      options: tagsOptions,
      internal: "internalValue",
    },
  ];

  const [userFilterState, setUserFilterState] = useQueryFilterState(
    [],
    "dashboard",
  );

  const agg = useMemo(
    () => (dateRange ? findClosestInterval(dateRange) ?? "7 days" : "7 days"),
    [dateRange],
  );

  const timeFilter = dateRange
    ? [
        {
          type: "datetime" as const,
          column: "startTime",
          operator: ">" as const,
          value: dateRange.from,
        },
        {
          type: "datetime" as const,
          column: "startTime",
          operator: "<" as const,
          value: dateRange.to,
        },
      ]
    : [];

  const mergedFilterState: FilterState = [...userFilterState, ...timeFilter];

  return (
    <div className="md:container">
      <Header title={project?.name ?? "Dashboard"} />
      <div className="my-3 flex flex-wrap items-center justify-between gap-2">
        <div className=" flex flex-col gap-2 lg:flex-row">
          <DatePickerWithRange
            dateRange={dateRange}
            setDateRangeAndOption={setDateRangeAndOption}
            selectedOption={selectedOption}
            className="my-0 max-w-full overflow-x-auto"
          />
          <PopoverFilterBuilder
            columns={filterColumns}
            filterState={userFilterState}
            onChange={setUserFilterState}
          />
        </div>        
      </div>
      <div className="grid w-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2 xl:grid-cols-6">
        <TracesBarListChart
          className="col-span-1 xl:col-span-2"
          projectId={projectId}
          globalFilterState={mergedFilterState}
        />
        {!disableExpensiveDashboardComponents && (
          <MetricTable
            className="col-span-1 xl:col-span-2"
            projectId={projectId}
            globalFilterState={mergedFilterState}
          />
        )}
        <ScoresTable
          className="col-span-1 xl:col-span-2"
          projectId={projectId}
          globalFilterState={mergedFilterState}
        />
        <TracesTimeSeriesChart
          className="col-span-1 xl:col-span-3"
          projectId={projectId}
          globalFilterState={mergedFilterState}
          agg={agg}
        />
        {!disableExpensiveDashboardComponents && (
          <ModelUsageChart
            className="col-span-1  min-h-24 xl:col-span-3"
            projectId={projectId}
            globalFilterState={mergedFilterState}
            agg={agg}
          />
        )}
        {!disableExpensiveDashboardComponents && (
          <UserChart
            className="col-span-1 xl:col-span-3"
            projectId={projectId}
            globalFilterState={mergedFilterState}
            agg={agg}
          />
        )}
        <ChartScores
          className="col-span-1 xl:col-span-3"
          agg={agg}
          projectId={projectId}
          globalFilterState={mergedFilterState}
        />
        {!disableExpensiveDashboardComponents && (
          <LatencyTables
            projectId={projectId}
            globalFilterState={mergedFilterState}
          />
        )}
        {!disableExpensiveDashboardComponents && (
          <GenerationLatencyChart
            className="col-span-1 flex-auto justify-between lg:col-span-full"
            projectId={projectId}
            agg={agg}
            globalFilterState={mergedFilterState}
          />
        )}
      </div>
    </div>
  );
}
