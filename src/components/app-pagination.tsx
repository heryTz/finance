import { getPageRange } from "@/lib/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export function AppPagination({
  pageSize,
  page,
  totalItems,
  onChange,
}: AppPaginationProps) {
  const pageCount = Math.ceil(totalItems / pageSize);
  const range = getPageRange({
    pageIndex: page,
    pageCount,
    maxVisiblePages: 5,
  });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onChange(Math.min(1, page - 1))} />
        </PaginationItem>
        {range.map((p) => {
          if (typeof p === "boolean") {
            return (
              <PaginationItem key="ellipsis">
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={p.toString()}>
              <PaginationLink isActive={p === page} onClick={() => onChange(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            onClick={() => onChange(Math.min(pageCount, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type AppPaginationProps = {
  page: number;
  totalItems: number;
  pageSize: number;
  onChange: (p: number) => void;
};
