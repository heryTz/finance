"use client";

import { Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { AlertPage } from "../alert-page";

export default function NotFound() {
  return (
    <AlertPage
      title="Page introuvable"
      message="Impossible de trouver la ressource demandée."
      action={{ href: "/", label: "Accueil" }}
    />
  );
}
