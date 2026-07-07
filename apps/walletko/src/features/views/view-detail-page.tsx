import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, PencilIcon, Settings, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { StatCard } from "src/features/dashboard/components/stat-card";
import { YearlyChart } from "src/features/dashboard/components/yearly-chart";
import { tagsQuery } from "src/features/tags/queries";
import { EditViewDialog } from "src/features/views/components/edit-view-dialog";
import {
  viewKeys,
  viewQuery,
  viewStatsQuery,
  viewYearStatsQuery,
} from "src/features/views/queries";
import { deleteViewFn } from "src/server/functions/views.fn";
import {
  humanizeFromCent,
  useFormatCurrency,
} from "src/shared/hooks/use-format-currency";
import {
  STAT_KEYS,
  useStatVisibility,
} from "src/shared/hooks/use-stat-visibility";
import {
  PageContent,
  PageHeader,
  SectionHeading,
} from "src/shared/layout/page";
import { Badge } from "src/shared/ui/badge";
import { Button } from "src/shared/ui/button";
import { ConfirmDeleteDialog } from "src/shared/ui/confirm-delete-dialog";
import { PageActions } from "src/shared/ui/page-actions";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";
import { Switch } from "src/shared/ui/switch";

const routeApi = getRouteApi("/_authenticated/views/$viewId");

export function ViewDetailPage() {
  const { viewId } = routeApi.useParams();
  const { formatFromCent } = useFormatCurrency();
  const { visible, toggle, labels } = useStatVisibility(
    `stat-visibility-view-${viewId}`,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  const qc = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteViewFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: viewKeys.list() });
      navigate({ to: "/views" });
    },
  });

  const { data: view } = useSuspenseQuery(viewQuery(viewId));
  const { data: stats } = useSuspenseQuery(viewStatsQuery(viewId));
  const { data: tags } = useSuspenseQuery(tagsQuery);
  const { data: yearStats } = useQuery({
    ...viewYearStatsQuery(viewId, selectedYear),
    placeholderData: keepPreviousData,
  });

  const tagNames: Record<string, string> = Object.fromEntries(
    tags.map((t) => [t.id, t.name]),
  );

  return (
    <PageContent>
      {/* Back link */}
      <div>
        <Button
          render={<Link to="/views" />}
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          All Views
        </Button>
      </div>

      <PageHeader
        title={view.name}
        subtitle={view.description ?? undefined}
        action={
          <PageActions
            mode="overflow"
            primary={{
              key: "edit",
              label: "Edit",
              icon: <PencilIcon className="size-4" />,
              onClick: () => setEditOpen(true),
              variant: "outline",
            }}
            secondary={[
              {
                key: "delete",
                label: "Delete",
                icon: <Trash2Icon className="size-4" />,
                onClick: () => setDeleteOpen(true),
                variant: "destructive",
              },
            ]}
          />
        }
      >
        {(view.nameFilter || view.tagIds.length > 0) && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {view.nameFilter && (
              <Badge variant="secondary" className="text-xs">
                name: {view.nameFilter}
              </Badge>
            )}
            {view.tagIds.map((id) => (
              <Badge key={id} variant="secondary" className="text-xs">
                {tagNames[id] ?? id}
              </Badge>
            ))}
          </div>
        )}
      </PageHeader>

      <SectionHeading
        title="Overview"
        action={
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 cursor-pointer text-muted-foreground"
                  aria-label="Customize visible stats"
                />
              }
            >
              <Settings className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-56">
              <div className="space-y-2">
                {STAT_KEYS.map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm">{labels[key]}</span>
                    <Switch
                      checked={visible.has(key)}
                      onCheckedChange={() => toggle(key)}
                      aria-label={labels[key]}
                    />
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {visible.has("totalBalance") && (
            <StatCard
              label="Net Balance"
              value={formatFromCent(stats.netBalance)}
              className="col-span-2"
            />
          )}
          {visible.has("monthIncome") && (
            <StatCard
              label="Income this month"
              value={formatFromCent(stats.monthIncome)}
              variant="income"
            />
          )}
          {visible.has("monthExpense") && (
            <StatCard
              label="Expenses this month"
              value={formatFromCent(stats.monthExpense)}
              variant="expense"
            />
          )}
          {visible.has("allTimeIncome") && (
            <StatCard
              label="All Time Income"
              value={humanizeFromCent(stats.allTimeIncome)}
              exactValue={formatFromCent(stats.allTimeIncome)}
              human
              variant="income"
            />
          )}
          {visible.has("allTimeExpense") && (
            <StatCard
              label="All Time Expense"
              value={humanizeFromCent(stats.allTimeExpense)}
              exactValue={formatFromCent(stats.allTimeExpense)}
              human
              variant="expense"
            />
          )}
        </div>
      </SectionHeading>

      {/* Yearly chart */}
      {yearStats && (
        <YearlyChart
          data={yearStats.months}
          year={selectedYear}
          availableYears={yearStats.availableYears}
          onYearChange={setSelectedYear}
        />
      )}

      <EditViewDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        view={view}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate({ data: { id: viewId } })}
        title="Delete View"
        items={view.name}
        isLoading={deleteMutation.isPending}
        error={deleteMutation.isError ? "Failed to delete view." : undefined}
      />
    </PageContent>
  );
}
