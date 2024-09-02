import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { StatFilterSheet } from "./stat-filter-sheet";
import { getStatsQuerySchema } from "../stat-dto";
import { zd } from "@/lib/zod";
import { ChipFilter } from "@/components/chip-filter";

export function StatFilter({ filter, onApply }: StatFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center flex-wrap gap-4">
        <Button StartIcon={PlusIcon} onClick={() => setOpen(true)}>
          Filtrer
        </Button>
        {filter.label && (
          <ChipFilter
            title="Libellé"
            value={filter.label}
            onClear={() => onApply({ label: undefined })}
          />
        )}
        {filter.tags.length > 0 && (
          <ChipFilter
            title="Tags"
            value={filter.tags.join(", ")}
            onClear={() => onApply({ tags: [] })}
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
  filter: zd.infer<typeof getStatsQuerySchema>;
  onApply: (data: Partial<zd.infer<typeof getStatsQuerySchema>>) => void;
};
