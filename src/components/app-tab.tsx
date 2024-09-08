"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
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
    <Tabs
      value={tab}
      onValueChange={onValueChange}
      className="flex flex-col flex-1"
    >
      <TabsList
        className="grid w-full max-w-[calc(100dvw-32px)] lg:max-w-[700px] overflow-auto justify-start mb-2"
        style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}
      >
        {tabs.map((el) => (
          <TabsTrigger key={el.name} value={el.name} className="shrink-0">
            {el.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((el) => (
        <TabsContent
          key={el.name}
          value={el.name}
          className={cn({ "flex flex-col flex-1": el.name === tab })}
        >
          {el.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}

type AppTabProps = {
  tabs: { name: string; title: string; component: ReactNode }[];
};
