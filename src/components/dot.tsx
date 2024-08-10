import { Box } from "@mui/material";

export function Dot({ color }: DotProps) {
  return (
    <Box
      sx={{
        backgroundColor: color,
        height: "16px",
        width: "16px",
        borderRadius: "100%",
      }}
    />
  );
}

type DotProps = {
  color: "lightpink" | "lightgreen";
};
