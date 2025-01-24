import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  TableState,
  useReactTable,
} from "@tanstack/react-table";
import { AppPagination } from "./app-pagination";
import { HScrollable } from "./h-scrollable";
import { useState } from "react";

export function DataTable<TData, TValue>({
  data,
  columns,
  onPaginationChange,
  initialState,
  state,
  manualPagination,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const [tableState, setTableState] = useState(state ?? initialState);

  const table = useReactTable({
    data,
    columns,
    initialState: tableState,
    state: tableState,
    rowCount,
    manualPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;
      const newPagination = updater(table.getState().pagination);
      setTableState({ ...table.getState(), pagination: newPagination });
      onPaginationChange?.(newPagination);
    },
  });

  return (
    <div className="grid gap-4">
      <HScrollable className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = (header.column.columnDef.meta ?? {}) as {
                    className?: string;
                  };
                  return (
                    <TableHead key={header.id} className={meta.className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = (cell.column.columnDef.meta ?? {}) as {
                      className?: string;
                    };
                    return (
                      <TableCell key={cell.id} className={meta.className}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </HScrollable>
      <AppPagination
        page={table.getState().pagination.pageIndex + 1}
        pageSize={table.getState().pagination.pageSize}
        totalItems={table.getRowCount()}
        onChange={(p) => table.setPageIndex(p - 1)}
      />
    </div>
  );
}

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  initialState?: Partial<TableState>;
  state?: Partial<TableState>;
  manualPagination?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  rowCount?: number;
};
