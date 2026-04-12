import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { zd } from "@/lib/zod";
import { ChipFilter } from "@/components/chip-filter";
import { OperationFilterSheet } from "./operation-filter-sheet";
import { operationFilterSheetSchema } from "../operation-dto";

export function OperationFilter({ filter, onApply }: OperationFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center flex-wrap gap-4">
        <Button
          variant={"secondary"}
          StartIcon={FilterIcon}
          onClick={() => setOpen(true)}
        >
          Filtrer
        </Button>
        {filter.label && (
          <ChipFilter
            title="Libellé"
            value={filter.label}
            onClear={() => onApply({ label: undefined })}
          />
        )}
        {!!filter.tags?.length && (
          <ChipFilter
            title="Tags"
            value={filter.tags.join(", ")}
            onClear={() => onApply({ tags: [] })}
          />
        )}
        <OperationFilterSheet
          open={open}
          onOpenChange={setOpen}
          value={filter}
          onApply={onApply}
        />
      </div>
    </>
  );
}

type OperationFilterProps = {
  filter: zd.infer<typeof operationFilterSheetSchema>;
  onApply: (data: Partial<zd.infer<typeof operationFilterSheetSchema>>) => void;
};
