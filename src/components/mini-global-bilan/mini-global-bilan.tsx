import { humanAmount } from "@/lib";
import { Box, Stack, Typography } from "@mui/material";

export function MiniGlobalBilan({ income, expense }: MiniGlobalBilanProps) {
  return (
    <Stack
      sx={{ marginBottom: 2 }}
      spacing={{ xs: 2, md: 3 }}
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography>Revenu:</Typography>
        <Typography color={"green"}>{humanAmount(income)}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography>Dépense:</Typography>
        <Typography color={"red"}>{humanAmount(expense)}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography>Reste:</Typography>
        <Typography sx={{ backgroundColor: "yellow", padding: "2px" }}>
          {humanAmount(income - expense)}
        </Typography>
      </Box>
    </Stack>
  );
}

type MiniGlobalBilanProps = {
  expense: number;
  income: number;
};
