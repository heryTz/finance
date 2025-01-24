"use client";

import { useState } from "react";
import { useSeo } from "@/lib/use-seo";
import { useOperationColumnDefs } from "./components/operation-column-defs";
import { DataTable } from "@/components/data-table";
import { OperationSave } from "./components/operation-save";
import { DataTableWrapper } from "@/components/data-table-wrapper";
import { GetOperations } from "./operation-service";
import { createSerializer, useQueryState } from "nuqs";
import {
  getOperationQuerySchema,
  getOperationQuerySerializer,
} from "./operation-dto";
import { zd } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";

const querySerializer = getOperationQuerySerializer();
const serializer = createSerializer({
  [querySerializer.key]: querySerializer.parser,
});

export function OperationPage({ operations }: OperationPageProps) {
  const router = useRouter();
  const { columns } = useOperationColumnDefs();
  const [openSave, setOpenSave] = useState(false);
  const [filter] = useQueryState(querySerializer.key, querySerializer.parser);

  const onFilter = (
    data: Partial<zd.infer<typeof getOperationQuerySchema>>,
  ) => {
    const newFilter = { ...filter, ...data };
    router.replace(routes.operation(serializer({ filter: newFilter })));
    router.refresh();
  };

  useSeo({ title: "Opération" });

  return (
    <DataTableWrapper
      title="Opération"
      count={operations.results.length ?? 0}
      cta={{ label: "Ajouter", onClick: () => setOpenSave(true) }}
      breadcrumb={[{ label: "Opération" }]}
      emptyProps={{
        title: "Aucune opération",
        description: 'Cliquez sur "Ajouter" pour créer une opération',
      }}
    >
      <DataTable
        data={operations.results}
        columns={columns}
        manualPagination
        rowCount={operations.total}
        initialState={{
          pagination: {
            pageIndex: (filter.page ?? 1) - 1,
            pageSize: filter.pageSize ?? 10,
          },
        }}
        onPaginationChange={({ pageIndex, pageSize }) =>
          onFilter({ page: pageIndex + 1, pageSize })
        }
      />
      {openSave && <OperationSave open={openSave} onOpenChange={setOpenSave} />}
    </DataTableWrapper>
  );
}

type OperationPageProps = {
  operations: GetOperations;
};
