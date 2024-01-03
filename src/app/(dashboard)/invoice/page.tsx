"use client";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { ConfigListing } from "./components/config/configListing";
import { ClientListing } from "./client/clientListing";

enum InvoiceTab {
  invoice = 1,
  client = 2,
  config = 3,
}

export default function InvoicePage() {
  const { push } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const tab = +(query.get("tab") ?? "") ?? InvoiceTab.invoice;

  const onChangeTab = (index: number) => {
    const q = new URLSearchParams(query.toString());
    q.set("tab", index.toString());
    push(`${pathname}?${q.toString()}`);
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_, index) => onChangeTab(index)}
          aria-label="Facture tab"
        >
          <Tab label="Facture" />
          <Tab label="Client" />
          <Tab label="Configuration" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ClientListing />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <ConfigListing />
      </TabPanel>
    </div>
  );
}

function TabPanel(props: PropsWithChildren<{ value: number; index: number }>) {
  const { children, value, index } = props;

  if (value !== index) return null;

  return (
    <Box role="tabpanel" sx={{ mt: 3 }}>
      {children}
    </Box>
  );
}
