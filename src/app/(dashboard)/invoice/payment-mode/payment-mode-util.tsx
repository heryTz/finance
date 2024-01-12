import { GridColDef } from "@mui/x-data-grid";
import {
  usePaymentsModeDeleteStore,
  usePaymentsModeSaveStore,
} from "./payment-mode-store";
import { humanDate } from "@/app/helper";
import { TableAction } from "@/components/table-action";

export function useColumnDefs() {
  const onUpdate = usePaymentsModeSaveStore((state) => state.onUpdate);
  const onDelete = usePaymentsModeDeleteStore((state) => state.onDelete);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nom", width: 400 },
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
          onUpdate={() => onUpdate(params.row.id)}
          onDelete={() =>
            onDelete({ id: params.row.id, label: params.row.name })
          }
        />
      ),
    },
  ];

  return { columns };
}
