import { ArchiveIcon, PencilIcon } from "lucide-react";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { useFormatDate } from "src/shared/hooks/use-format-date";
import { DataListRow } from "src/shared/ui/data-list";
import { DropdownMenuItem } from "src/shared/ui/dropdown-menu";
import { RowActions } from "src/shared/ui/row-actions";

export type PotListItem = {
  id: string;
  name: string;
  percentage: number;
  balance: number;
  color: string;
  isDefault: boolean;
  createdAt: Date | string;
};

type PotRowProps = {
  pot: PotListItem;
  onEdit: (pot: PotListItem) => void;
  onArchive: (pot: PotListItem) => void;
};

export function PotRow({ pot, onEdit, onArchive }: PotRowProps) {
  const { formatFromCent } = useFormatCurrency();
  const formatDate = useFormatDate();

  return (
    <DataListRow>
      <span
        className="size-3 shrink-0 rounded-full"
        style={{ backgroundColor: pot.color }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{pot.name}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatDate(pot.createdAt)}
        </p>
      </div>
      <span className="w-12 text-right text-sm text-muted-foreground tabular-nums">
        {pot.percentage}%
      </span>
      <span className="w-24 text-right text-sm font-medium tabular-nums">
        {formatFromCent(pot.balance)}
      </span>
      <RowActions label={`Actions for ${pot.name}`}>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => onEdit(pot)}
        >
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
        {!pot.isDefault && (
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            variant="destructive"
            onClick={() => onArchive(pot)}
          >
            <ArchiveIcon className="size-4" />
            Archive
          </DropdownMenuItem>
        )}
      </RowActions>
    </DataListRow>
  );
}
