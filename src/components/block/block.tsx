import { Grid, Paper, Stack } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import { BlockTitle } from "../block-title";

export function Block({ title, actionBar, footer, children }: BlockProps) {
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <BlockTitle>{title}</BlockTitle>
        {actionBar}
      </Stack>
      {children}
      {footer}
    </Paper>
  );
}

type BlockProps = PropsWithChildren<{
  title: string;
  actionBar?: ReactNode;
  footer?: ReactNode;
}>;
