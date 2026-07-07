import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";
import type { TransactionDTO } from "src/server/contracts/transaction";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { useFormatDate } from "src/shared/hooks/use-format-date";
import { cn } from "src/shared/lib/utils";
import { Badge } from "src/shared/ui/badge";
import { DataListRow } from "src/shared/ui/data-list";
import { DropdownMenuItem } from "src/shared/ui/dropdown-menu";
import { HighlightMatch } from "src/shared/ui/highlight-match";
import { RowActions } from "src/shared/ui/row-actions";

export function TransactionRow({
  tx,
  nameQuery,
  onEdit,
  onDelete,
}: {
  tx: TransactionDTO;
  nameQuery: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const { formatFromCent } = useFormatCurrency();
  const formatDate = useFormatDate();
  return (
    <DataListRow>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          tx.type === "income" && "bg-income-subtle",
          tx.type === "transfer" && "bg-transfer-subtle",
          tx.type === "expense" && "bg-destructive-subtle",
          tx.type === "canceled_income" && "bg-muted",
          tx.type === "income_cancellation" && "bg-transfer-subtle",
          tx.type === "canceled_expense" && "bg-muted",
          tx.type === "expense_cancellation" && "bg-transfer-subtle",
        )}
      >
        {tx.type === "income" && (
          <ArrowDownLeft className="size-4 text-income" />
        )}
        {tx.type === "transfer" && (
          <ArrowLeftRight className="size-4 text-transfer" />
        )}
        {tx.type === "expense" && (
          <ArrowUpRight className="size-4 text-destructive" />
        )}
        {tx.type === "canceled_income" && (
          <ArrowDownLeft className="size-4 text-muted-foreground" />
        )}
        {tx.type === "income_cancellation" && (
          <ArrowLeftRight className="size-4 text-transfer" />
        )}
        {tx.type === "canceled_expense" && (
          <ArrowUpRight className="size-4 text-muted-foreground" />
        )}
        {tx.type === "expense_cancellation" && (
          <ArrowLeftRight className="size-4 text-transfer" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-semibold">
            <HighlightMatch text={tx.name} query={nameQuery} />
          </p>
          {tx.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="h-4 px-1.5 py-0 text-[11px]"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        <p className="mt-0.5 text-[13px] text-muted-foreground tabular-nums">
          {formatDate(tx.createdAt)}
        </p>
      </div>

      <p
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          tx.type === "income" && "text-income",
          tx.type === "transfer" && "text-transfer",
          tx.type === "expense" && "text-destructive",
          tx.type === "canceled_income" && "text-muted-foreground line-through",
          tx.type === "income_cancellation" && "text-transfer",
          tx.type === "canceled_expense" &&
            "text-muted-foreground line-through",
          tx.type === "expense_cancellation" && "text-transfer",
        )}
      >
        {tx.type === "income" && "+"}
        {tx.type === "expense" && "−"}
        {tx.type === "income_cancellation" && "↺ "}
        {tx.type === "expense_cancellation" && "↺ "}
        {formatFromCent(tx.amount)}
      </p>

      {tx.type === "income" || tx.type === "expense" ? (
        <RowActions label={`Actions for ${tx.name}`}>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => onEdit?.(tx.id)}
          >
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2"
            onClick={() => onDelete?.(tx.id)}
          >
            <Trash2 className="size-4" />
            {tx.type === "income" ? "Cancel income" : "Cancel expense"}
          </DropdownMenuItem>
        </RowActions>
      ) : (
        <div className="size-8 shrink-0" />
      )}
    </DataListRow>
  );
}
