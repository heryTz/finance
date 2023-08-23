"use client";
import { FinanceType } from "@/entity";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Tag } from "@prisma/client";

export function FinanceSaveDialog({
  open,
  onClose,
  onFinish,
}: FinanceSaveDialogProps) {
  const tags: Tag[] = [
    { id: "x1", name: "tag1", createdAt: new Date(), updatedAt: null },
    { id: "x2", name: "tag2", createdAt: new Date(), updatedAt: null },
  ];

  return (
    <Dialog open={open} keepMounted maxWidth="sm" fullWidth>
      <DialogTitle>Ajout</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Libellé" />
          <TextField select label="Type">
            <MenuItem value={FinanceType.revenue}>Revenue</MenuItem>
            <MenuItem value={FinanceType.depense}>Dépense</MenuItem>
          </TextField>
          <TextField label="Montant" type="number" />
          <Autocomplete
            multiple
            freeSolo
            options={tags}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            defaultValue={[tags[0]]}
            filterSelectedOptions
            renderInput={(params) => <TextField {...params} label="Tags" />}
          />
          <DatePicker label="Date de création" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={() => {}}>Sauvegarder</Button>
      </DialogActions>
    </Dialog>
  );
}

type FinanceSaveDialogProps = {
  open: boolean;
  onClose: () => void;
  onFinish: () => void;
};
