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
import { useMq } from "@/lib/use-mq";

export function AppPagination({
  pageSize,
  page,
  totalItems,
  onChange,
}: AppPaginationProps) {
  const { isMD } = useMq();
  const pageCount = Math.ceil(totalItems / pageSize);
  const range = isMD
    ? getPageRange({
        pageIndex: page,
        pageCount,
        maxVisiblePages: 5,
      })
    : [page];

  const offsetCount = pageSize * (page - 1);

  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onChange(Math.min(1, page - 1))}
            />
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
                <PaginationLink
                  isActive={p === page}
                  onClick={() => onChange(p)}
                >
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
      <div className="mx-auto flex justify-center items-center text-muted-foreground text-sm">
        {offsetCount + 1}-{offsetCount + pageSize} sur {totalItems} résultats
      </div>
    </>
  );
}

type AppPaginationProps = {
  page: number;
  totalItems: number;
  pageSize: number;
  onChange: (p: number) => void;
};
