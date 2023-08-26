import { humanAmount, humanDate } from "@/app/helper";
import { Dot } from "@/components/dot";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Chip, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Tag } from "@prisma/client";
import { useFinanceSaveStore } from "./finance-store";

export function useColumnDefs() {
  const { onUpdate } = useFinanceSaveStore();

  const columns: GridColDef[] = [
    { field: "label", headerName: "Libellé", width: 350 },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <Dot color={params.value === "depense" ? "lightpink" : "lightgreen"} />
      ),
    },
    {
      field: "amount",
      headerName: "Montant",
      width: 100,
      align: "right",
      renderCell: (params) => humanAmount(params.value),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {(params.value as Tag[]).map((el) => (
            <Chip key={el.name} label={el.name} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Création",
      width: 100,
      renderCell: (params) => humanDate(params.value),
    },
    {
      field: "updatedAt",
      headerName: "Modification",
      width: 100,
      renderCell: (params) => humanDate(params.value),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={() => onUpdate(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton size="small">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return { columns };
}
