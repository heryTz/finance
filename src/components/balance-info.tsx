import { humanAmount } from "@/lib/humanizer";
import { Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useGetStatCounter } from "@/query/stat-query";
import { Spinner } from "./spinner";

export function BalanceInfo() {
  const counter = useGetStatCounter();

  return (
    <div className="-mx-2">
      <Card>
        <CardHeader className="px-2 pt-2 pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm tracking-tight">Balance</CardTitle>
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2 pt-0">
          <div className="text-sm text-muted-foreground">
            {counter.isLoading || !counter.data ? (
              <Spinner className="w-4 h-4 fill-muted-foreground" />
            ) : (
              humanAmount(counter.data.currentBalance.value)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
