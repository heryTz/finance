import { humanAmount } from "@/app/helper";
import { Box, Typography } from "@mui/material";

export function MiniGlobalBilan({ revenue, depense }: MiniGlobalBilanProps) {
  return (
    <Box
      sx={{ display: "flex", gap: 3, marginBottom: 2, alignItems: "center" }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography>Revenue:</Typography>
        <Typography color={"green"}>{humanAmount(revenue)}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography>Dépense:</Typography>
        <Typography color={"red"}>{humanAmount(depense)}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography>Reste:</Typography>
        <Typography sx={{ backgroundColor: "yellow", padding: "2px" }}>
          {humanAmount(revenue - depense)}
        </Typography>
      </Box>
    </Box>
  );
}

type MiniGlobalBilanProps = {
  revenue: number;
  depense: number;
};
