"use client";

import { Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      maxWidth={"500px"}
      marginX={"auto"}
      marginY={"48px"}
      gap={1}
    >
      <Typography variant="h2">Page introuvable</Typography>
      <Typography variant="body1">
        Impossible de trouver la ressource demandée
      </Typography>
      <Link href="/" component={NextLink}>
        Accueil
      </Link>
    </Stack>
  );
}
