import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  PlusIcon,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { tagsQuery } from "src/features/tags/queries";
import { AddExpenseDialog } from "src/features/transactions/components/add-expense-dialog";
import { AddIncomeDialog } from "src/features/transactions/components/add-income-dialog";
import { CancelExpenseDialog } from "src/features/transactions/components/cancel-expense-dialog";
import { CancelIncomeDialog } from "src/features/transactions/components/cancel-income-dialog";
import { EditExpenseDialog } from "src/features/transactions/components/edit-expense-dialog";
import { EditIncomeDialog } from "src/features/transactions/components/edit-income-dialog";
import { TransactionRow } from "src/features/transactions/components/transaction-row";
import { transactionsQuery } from "src/features/transactions/queries";
import { useDebouncedValue } from "src/shared/hooks/use-debounced-value";
import { PageContent, PageHeader } from "src/shared/layout/page";
import { cn } from "src/shared/lib/utils";
import { Badge } from "src/shared/ui/badge";
import { Button } from "src/shared/ui/button";
import { DataList, DataListHead } from "src/shared/ui/data-list";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/shared/ui/dropdown-menu";
import { EmptyState } from "src/shared/ui/empty-state";
import { FilterChip } from "src/shared/ui/filter-chip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "src/shared/ui/input-group";
import { PageActions } from "src/shared/ui/page-actions";
import { Pagination } from "src/shared/ui/pagination";
import { ToggleGroup, ToggleGroupItem } from "src/shared/ui/toggle-group";

const routeApi = getRouteApi("/_authenticated/transactions");

const TYPE_LABELS: Record<string, string> = {
  income: "Income",
  expense: "Expense",
  canceled_income: "Cancelled",
  income_cancellation: "Cancellations",
};

export function TransactionsPage() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const [addIncomeOpen, setAddIncomeOpen] = useState(false);
  const [editIncomeId, setEditIncomeId] = useState<string | null>(null);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const [cancelIncome, setCancelIncome] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [cancelExpense, setCancelExpense] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { types, name: nameQuery, tagIds: selectedTagIds, page } = search;

  const { data: transactionsResult } = useSuspenseQuery(
    transactionsQuery({
      types,
      name: nameQuery,
      tagIds: selectedTagIds,
      page,
    }),
  );
  const { data: tagSuggestions } = useSuspenseQuery(tagsQuery);

  const { items, total, totalPages } = transactionsResult;

  const [nameInput, setNameInput] = useState(nameQuery);
  const debouncedName = useDebouncedValue(nameInput, 300);

  useEffect(() => {
    if (debouncedName !== nameQuery) {
      navigate({
        search: (prev) => ({ ...prev, name: debouncedName, page: 1 }),
        replace: true,
      });
    }
  }, [debouncedName, nameQuery, navigate]);

  useEffect(() => {
    setNameInput(nameQuery);
  }, [nameQuery]);

  const selectedTags = selectedTagIds
    .map((id) => tagSuggestions.find((tag) => tag.id === id))
    .filter((tag): tag is (typeof tagSuggestions)[number] => Boolean(tag));

  const hasActiveFilters =
    types.length > 0 || selectedTagIds.length > 0 || nameQuery !== "";

  const toggleTag = (tagId: string) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    navigate({ search: (prev) => ({ ...prev, tagIds: next, page: 1 }) });
  };

  const handleTypeChange = (values: string[]) => {
    navigate({ search: (prev) => ({ ...prev, types: values, page: 1 }) });
  };

  const clearAllFilters = () => {
    setNameInput("");
    navigate({
      search: () => ({ types: [], name: "", tagIds: [], page: 1 }),
    });
  };

  return (
    <PageContent>
      <PageHeader
        title="Transactions"
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

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="w-full sm:max-w-xs">
          <InputGroupAddon>
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="size-3.5" />
            </span>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search transactions…"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            aria-label="Search transactions by name"
          />
          {nameInput && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => setNameInput("")}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <ToggleGroup
            multiple
            value={types}
            onValueChange={handleTypeChange}
            variant="outline"
          >
            <ToggleGroupItem value="income" className="cursor-pointer">
              Income
            </ToggleGroupItem>
            <ToggleGroupItem value="expense" className="cursor-pointer">
              Expense
            </ToggleGroupItem>
            <ToggleGroupItem value="canceled_income" className="cursor-pointer">
              Cancelled
            </ToggleGroupItem>
            <ToggleGroupItem
              value="income_cancellation"
              className="cursor-pointer"
            >
              Cancellations
            </ToggleGroupItem>
          </ToggleGroup>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border border-input bg-transparent",
                "cursor-pointer hover:bg-muted transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              Tags
              {selectedTagIds.length > 0 && (
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 h-4 text-xs tabular-nums"
                >
                  {selectedTagIds.length}
                </Badge>
              )}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {tagSuggestions.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTagIds.includes(tag.id)}
                  onCheckedChange={() => toggleTag(tag.id)}
                  className="cursor-pointer"
                >
                  {tag.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters + ledger count */}
      <div className="flex min-h-6 flex-wrap items-center gap-2">
        {types.map((t) => (
          <FilterChip
            key={t}
            label={TYPE_LABELS[t] ?? t}
            removeLabel={`Clear ${TYPE_LABELS[t] ?? t} filter`}
            onRemove={() =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  types: prev.types.filter((x) => x !== t),
                  page: 1,
                }),
              })
            }
          />
        ))}
        {selectedTags.map((tag) => (
          <FilterChip
            key={tag.id}
            prefix="Tag:"
            label={tag.name}
            removeLabel={`Remove ${tag.name} tag`}
            onRemove={() => toggleTag(tag.id)}
          />
        ))}
        {nameQuery !== "" && (
          <FilterChip
            label={`“${nameQuery}”`}
            removeLabel="Clear search"
            onRemove={() => {
              setNameInput("");
              navigate({
                search: (prev) => ({ ...prev, name: "", page: 1 }),
              });
            }}
          />
        )}
        {hasActiveFilters && (
          <Button
            variant="link"
            size="xs"
            onClick={clearAllFilters}
            className="h-6 cursor-pointer px-1 text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {total} {total === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Transaction list */}
      {items.length === 0 &&
        (hasActiveFilters ? (
          <EmptyState>
            <div className="flex flex-col items-center gap-3">
              <span>No transactions match your filters.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="cursor-pointer"
              >
                Clear filters
              </Button>
            </div>
          </EmptyState>
        ) : (
          <EmptyState>No transactions yet. Use Add to get started.</EmptyState>
        ))}

      {items.length > 0 && (
        <DataList
          header={
            <>
              <div className="size-8 shrink-0" />
              <DataListHead className="flex-1">Description</DataListHead>
              <DataListHead className="w-16 text-right">Date</DataListHead>
              <DataListHead className="w-24 text-right">Amount</DataListHead>
              <div className="size-8 shrink-0" />
            </>
          }
        >
          {items.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              nameQuery={nameQuery}
              onEdit={(id) => {
                if (tx.type === "income") setEditIncomeId(id);
                else if (tx.type === "expense") setEditExpenseId(id);
              }}
              onDelete={(id) => {
                if (tx.type === "income")
                  setCancelIncome({ id, name: tx.name });
                else if (tx.type === "expense")
                  setCancelExpense({ id, name: tx.name });
              }}
            />
          ))}
        </DataList>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(next) =>
          navigate({ search: (prev) => ({ ...prev, page: next }) })
        }
      />

      <AddIncomeDialog open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
      <EditIncomeDialog
        incomeId={editIncomeId}
        onOpenChange={(open) => {
          if (!open) setEditIncomeId(null);
        }}
      />
      <AddExpenseDialog
        open={addExpenseOpen}
        onOpenChange={setAddExpenseOpen}
      />
      <EditExpenseDialog
        expenseId={editExpenseId}
        onOpenChange={(open) => {
          if (!open) setEditExpenseId(null);
        }}
      />
      <CancelIncomeDialog
        income={cancelIncome}
        onOpenChange={(open) => {
          if (!open) setCancelIncome(null);
        }}
      />
      <CancelExpenseDialog
        expense={cancelExpense}
        onOpenChange={(open) => {
          if (!open) setCancelExpense(null);
        }}
      />
    </PageContent>
  );
}
