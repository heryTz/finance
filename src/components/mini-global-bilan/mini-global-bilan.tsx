import { humanAmount } from "@/app/helper";
import { Box, Stack, Typography } from "@mui/material";

export function MiniGlobalBilan({ revenue, depense }: MiniGlobalBilanProps) {
  return (
    <Stack
      sx={{ marginBottom: 2 }}
      spacing={{ xs: 2, md: 3 }}
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography>Revenu:</Typography>
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
    </Stack>
  );
}

type MiniGlobalBilanProps = {
  revenue: number;
  depense: number;
};
