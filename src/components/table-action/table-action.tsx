import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { ReactNode } from "react";

export function TableAction({ onDelete, onUpdate, buttons }: TableActionProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {buttons}
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
  buttons?: ReactNode;
};
