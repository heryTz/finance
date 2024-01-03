import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export function TableAction({ onDelete, onUpdate }: TableActionProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton size="small" onClick={() => onUpdate()}>
        <Edit />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete()}>
        <Delete />
      </IconButton>
    </Box>
  );
}

type TableActionProps = {
  onUpdate: () => void;
  onDelete: () => void;
};
