import { Button } from "@/components/ui/button";
import { PlusIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { StatFilterSheet } from "./stat-filter-sheet";
import { createSerializer, useQueryState } from "nuqs";
import {
  defaultGetStatsQuery,
  getStatsQuerySchema,
  getStatsQuerySerializer,
} from "../stat-dto";
import { zd } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { ChipFilter } from "@/components/chip-filter";
import { humanDate } from "@/lib/humanizer";
import { Separator } from "@/components/ui/separator";

const querySerializer = getStatsQuerySerializer();

const serializer = createSerializer({
  [querySerializer.key]: querySerializer.parser,
});

export function StatFilter({ defaultFilter }: StatFilterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useQueryState(
    querySerializer.key,
    querySerializer.parser,
  );

  useEffect(() => {
    setFilter(defaultFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilter]);

  const onApply = (data: zd.infer<typeof getStatsQuerySchema>) => {
    setFilter(data);
    router.replace(`/${serializer({ filter: data })}`);
  };

  return (
    <>
      <div className="flex items-center flex-wrap gap-4">
        <Button StartIcon={PlusIcon} onClick={() => setOpen(true)}>
          Filtrer
        </Button>
        {filter.range && (
          <ChipFilter
            ClearIcon={RotateCcwIcon}
            title="Date de création"
            value={`${humanDate(filter.range.from)} - ${humanDate(filter.range.to)}`}
            onClear={() =>
              onApply({ ...filter, range: defaultGetStatsQuery.range })
            }
          />
        )}
        <Separator orientation="vertical" className="h-6" />
        {filter.label && (
          <ChipFilter
            title="Libellé"
            value={filter.label}
            onClear={() => onApply({ ...filter, label: undefined })}
          />
        )}
        {filter.tags.length > 0 && (
          <ChipFilter
            title="Tags"
            value={filter.tags.join(", ")}
            onClear={() => onApply({ ...filter, tags: [] })}
          />
        )}
        <StatFilterSheet
          open={open}
          onOpenChange={setOpen}
          value={filter}
          onApply={onApply}
        />
      </div>
    </>
  );
}

type StatFilterProps = {
  defaultFilter: zd.infer<typeof getStatsQuerySchema>;
};
