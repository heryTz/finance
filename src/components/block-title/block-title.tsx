import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export function BlockTitle({ children }: BlockTitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  );
}

type BlockTitleProps = PropsWithChildren<{}>;
