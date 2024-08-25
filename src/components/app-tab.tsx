"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function AppTab({ tabs }: AppTabProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const tab = query.get("tab") ?? tabs[0].name;

  const onValueChange = (name: string) => {
    const q = new URLSearchParams(query.toString());
    q.set("tab", name);
    push(`${pathname}?${q.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={onValueChange}>
      <TabsList
        className="grid w-full max-w-[700px]"
        style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}
      >
        {tabs.map((el) => (
          <TabsTrigger key={el.name} value={el.name}>
            {el.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((el) => (
        <TabsContent key={el.name} value={el.name}>
          {el.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}

type AppTabProps = {
  tabs: { name: string; title: string; component: ReactNode }[];
};
