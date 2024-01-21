"use client";
import { Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export function AlertPage({ title, message, action }: AlertPageProps) {
  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      maxWidth={"500px"}
      marginX={"auto"}
      marginY={"48px"}
      gap={1}
    >
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{message}</Typography>
      {action && action.href && (
        <Link href={action.href} component={NextLink}>
          {action.label}
        </Link>
      )}
    </Stack>
  );
}

type AlertPageProps = {
  title: string;
  message: string;
  action?: {
    href: string;
    label: string;
  };
};
