import { DataList, DataListRow } from "src/shared/ui/data-list";
import { Skeleton } from "src/shared/ui/skeleton";

export function TagListSkeleton() {
  return (
    <DataList>
      {[0, 1, 2].map((i) => (
        <DataListRow key={i}>
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-5 w-6" />
          <Skeleton className="size-8" />
        </DataListRow>
      ))}
    </DataList>
  );
}
