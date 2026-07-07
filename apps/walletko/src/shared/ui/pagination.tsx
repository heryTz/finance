import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";

const range = (start: number, end: number) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | "dots")[] {
  const totalPageNumbers = siblingCount * 2 + 5;
  if (totalPageNumbers >= totalPages) return range(1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + 2 * siblingCount), "dots", totalPages];
  }
  if (showLeftDots && !showRightDots) {
    return [
      1,
      "dots",
      ...range(totalPages - (2 + 2 * siblingCount), totalPages),
    ];
  }
  return [1, "dots", ...range(leftSibling, rightSibling), "dots", totalPages];
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  pageSize,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationRange(page, totalPages);
  const showSummary = total != null && pageSize != null;
  const from = (page - 1) * (pageSize ?? 0) + 1;
  const to = Math.min(page * (pageSize ?? 0), total ?? 0);

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        showSummary ? "justify-between" : "justify-center",
        className,
      )}
    >
      {showSummary && (
        <p className="text-xs tabular-nums text-muted-foreground">
          {from}–{to} of {total}
        </p>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="cursor-pointer"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        {items.map((item, i) =>
          item === "dots" ? (
            <span
              key={`dots-${items[i - 1]}`}
              className="select-none px-1 text-sm text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "default" : "ghost"}
              size="icon-sm"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className="cursor-pointer tabular-nums"
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="cursor-pointer"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
