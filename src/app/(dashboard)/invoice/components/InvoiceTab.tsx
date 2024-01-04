"use client";
import { Box, Tab, Tabs } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

export function InvoiceTab({ tabs }: InvoiceTabProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const tab = +(query.get("tab") ?? "") ?? 0;

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
          {tabs.map((el) => (
            <Tab key={el.index} label={el.title} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((el) => (
        <TabPanel key={el.index} value={tab} index={el.index}>
          {el.component}
        </TabPanel>
      ))}
    </div>
  );
}

type InvoiceTabProps = {
  tabs: { index: 0 | 1 | 2; title: string; component: ReactNode }[];
};

function TabPanel(props: PropsWithChildren<{ value: number; index: number }>) {
  const { children, value, index } = props;

  if (value !== index) return null;

  return (
    <Box role="tabpanel" sx={{ mt: 3 }}>
      {children}
    </Box>
  );
}
