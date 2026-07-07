import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, PlusIcon, Settings } from "lucide-react";
import { useState } from "react";
import { PotStatCard } from "src/features/dashboard/components/pot-stat-card";
import { StatCard } from "src/features/dashboard/components/stat-card";
import { YearlyChart } from "src/features/dashboard/components/yearly-chart";
import {
  overviewStatsQuery,
  topPotsQuery,
  yearStatsQuery,
} from "src/features/dashboard/queries";
import { AddExpenseDialog } from "src/features/transactions/components/add-expense-dialog";
import { AddIncomeDialog } from "src/features/transactions/components/add-income-dialog";
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
import { Button } from "src/shared/ui/button";
import { PageActions } from "src/shared/ui/page-actions";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";
import { Switch } from "src/shared/ui/switch";

const user = { name: "Hery Nirintsoa" };

export function DashboardPage() {
  const { formatFromCent } = useFormatCurrency();
  const { visible, toggle, labels } = useStatVisibility();
  const [addIncomeOpen, setAddIncomeOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: overview } = useSuspenseQuery(overviewStatsQuery);
  const { data: topPots } = useSuspenseQuery(topPotsQuery());
  const { data: yearStats } = useQuery({
    ...yearStatsQuery(selectedYear),
    placeholderData: keepPreviousData,
  });

  return (
    <PageContent>
      <PageHeader
        eyebrow="Welcome back,"
        title={user.name}
        action={
          <PageActions
            primary={{
              key: "add",
              label: "Add",
              icon: <PlusIcon className="size-4" />,
              onClick: () => {},
              items: [
                {
                  key: "income",
                  label: "Income",
                  icon: <ArrowDownLeft className="size-4" />,
                  onClick: () => setAddIncomeOpen(true),
                },
                {
                  key: "expense",
                  label: "Expense",
                  icon: <ArrowUpRight className="size-4" />,
                  onClick: () => setAddExpenseOpen(true),
                },
              ],
            }}
          />
        }
      />

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
              label="Total Balance"
              value={formatFromCent(overview.totalBalance)}
              className="col-span-2"
            />
          )}
          {visible.has("monthIncome") && (
            <StatCard
              label="Income this month"
              value={formatFromCent(overview.monthIncome)}
              variant="income"
            />
          )}
          {visible.has("monthExpense") && (
            <StatCard
              label="Expenses this month"
              value={formatFromCent(overview.monthExpense)}
              variant="expense"
            />
          )}
          {visible.has("allTimeIncome") && (
            <StatCard
              label="All Time Income"
              value={humanizeFromCent(overview.allTimeIncome)}
              exactValue={formatFromCent(overview.allTimeIncome)}
              human
              variant="income"
            />
          )}
          {visible.has("allTimeExpense") && (
            <StatCard
              label="All Time Expense"
              value={humanizeFromCent(overview.allTimeExpense)}
              exactValue={formatFromCent(overview.allTimeExpense)}
              human
              variant="expense"
            />
          )}
        </div>
      </SectionHeading>

      {topPots.length > 0 && (
        <SectionHeading title="Top Pots">
          {/* Mobile: horizontal scroll */}
          <div className="lg:hidden flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
            {topPots.map((pot) => (
              <div key={pot.id} className="min-w-[160px] snap-start">
                <PotStatCard
                  name={pot.name}
                  balance={pot.balance}
                  color={pot.color}
                  percentage={pot.percentage}
                />
              </div>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden lg:grid grid-cols-4 gap-3">
            {topPots.map((pot) => (
              <PotStatCard
                key={pot.id}
                name={pot.name}
                balance={pot.balance}
                color={pot.color}
                percentage={pot.percentage}
              />
            ))}
          </div>
        </SectionHeading>
      )}

      {/* Yearly chart */}
      {yearStats && (
        <YearlyChart
          data={yearStats.months}
          year={selectedYear}
          availableYears={yearStats.availableYears}
          onYearChange={setSelectedYear}
        />
      )}

      <AddIncomeDialog open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
      <AddExpenseDialog
        open={addExpenseOpen}
        onOpenChange={setAddExpenseOpen}
      />
    </PageContent>
  );
}
