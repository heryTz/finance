export const CURRENCY = ["Ar", "EUR"] as const;
export type Currency = (typeof CURRENCY)[number];

import { GridColDef } from "@mui/x-data-grid";
import { useInvoiceDeleteStore } from "./invoice-store";
import { humanAmount, humanDate } from "@/app/helper";
import { TableAction } from "@/components/table-action";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { Box, Stack, Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";

export function useColumnDefs() {
  const { push } = useRouter();
  const onDelete = useInvoiceDeleteStore((state) => state.onDelete);

  const columns: GridColDef[] = [
    {
      field: "ref",
      headerName: "Ref",
      width: 100,
      renderCell: (params) => params.value,
    },
    {
      field: "Client",
      headerName: "Client",
      width: 300,
      renderCell: (params) => params.value.name,
    },
    {
      field: "productsLength",
      headerName: "Nb Produits",
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const count = params.row.Products.length;
        return (
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <span>{count}</span>
            <Box width={24} height={24}>
              {!!count && (
                <Tooltip
                  placement="right"
                  title={params.row.Products.map((el: Product) => el.name).join(
                    ", "
                  )}
                >
                  <Info />
                </Tooltip>
              )}
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "Products",
      headerName: "Total",
      align: "right",
      headerAlign: "right",
      width: 150,
      renderCell: (params) => {
        const sum = params.value.reduce(
          (acc: number, cur: Product) => acc + cur.price * cur.qte,
          0
        );
        return `${humanAmount(sum)} ${params.row.currency}`;
      },
    },
    {
      field: "createdAt",
      headerName: "Création",
      width: 150,
      renderCell: (params) => humanDate(params.value),
    },
    {
      field: "updatedAt",
      headerName: "Modification",
      width: 150,
      renderCell: (params) => humanDate(params.value),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <TableAction
          onUpdate={() => push(`/invoice/${params.row.id}/edit`)}
          onDelete={() =>
            onDelete({ id: params.row.id, label: params.row.name })
          }
        />
      ),
    },
  ];

  return { columns };
}
