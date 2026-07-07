import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { viewStatsQuery } from "src/features/views/queries";
import type { SavedViewListItem } from "src/server/contracts/saved-view";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { Badge } from "src/shared/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/shared/ui/card";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "src/shared/ui/dropdown-menu";
import { RowActions } from "src/shared/ui/row-actions";

function ViewStatsPreview({ viewId }: { viewId: string }) {
  const { formatFromCent } = useFormatCurrency();
  const { data: stats } = useQuery(viewStatsQuery(viewId));
  if (!stats) return <span className="text-muted-foreground text-sm">—</span>;
  const isPositive = stats.netBalance >= 0;
  return (
    <span
      className={
        isPositive
          ? "text-income font-semibold text-sm"
          : "text-destructive font-semibold text-sm"
      }
    >
      {formatFromCent(stats.netBalance)}
    </span>
  );
}

export type ViewCardProps = {
  view: SavedViewListItem;
  tagNames: Record<string, string>;
  onEdit: (view: SavedViewListItem) => void;
  onDelete: (view: SavedViewListItem) => void;
};

export function ViewCard({ view, tagNames, onEdit, onDelete }: ViewCardProps) {
  return (
    <Card className="group/view relative transition hover:-translate-y-0.5 hover:shadow-md hover:ring-foreground/20">
      <Link
        to="/views/$viewId"
        params={{ viewId: view.id }}
        aria-label={`Open ${view.name}`}
        className="absolute inset-0 z-0 rounded-xl"
      />

      <CardHeader>
        <CardTitle>{view.name}</CardTitle>
        {view.description && (
          <CardDescription>{view.description}</CardDescription>
        )}
        <CardAction className="relative z-10">
          <RowActions label={`Options for ${view.name}`}>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(view)}
            >
              <PencilIcon className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              onClick={() => onDelete(view)}
            >
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          </RowActions>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {view.nameFilter && (
            <Badge variant="secondary" className="text-xs">
              name: {view.nameFilter}
            </Badge>
          )}
          {view.tagIds.map((id) => (
            <Badge key={id} variant="secondary" className="text-xs">
              {tagNames[id] ?? id}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Net <ViewStatsPreview viewId={view.id} />
        </div>
        <ChevronRightIcon className="size-4 text-primary transition-transform group-hover/view:translate-x-0.5" />
      </CardFooter>
    </Card>
  );
}
