import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { AddTagDialog } from "src/features/tags/components/add-tag-dialog";
import { EditTagDialog } from "src/features/tags/components/edit-tag-dialog";
import { TagListSkeleton } from "src/features/tags/components/tag-list-skeleton";
import {
  TAGS_PAGE_SIZE,
  tagKeys,
  tagsPagedQuery,
} from "src/features/tags/queries";
import { deleteTagFn } from "src/server/functions/tags.fn";
import { PageContent, PageHeader } from "src/shared/layout/page";
import { Badge } from "src/shared/ui/badge";
import { ConfirmDeleteDialog } from "src/shared/ui/confirm-delete-dialog";
import { DataList, DataListHead, DataListRow } from "src/shared/ui/data-list";
import { DropdownMenuItem } from "src/shared/ui/dropdown-menu";
import { EmptyState } from "src/shared/ui/empty-state";
import { ErrorState } from "src/shared/ui/error-state";
import { PageActions } from "src/shared/ui/page-actions";
import { Pagination } from "src/shared/ui/pagination";
import { RowActions } from "src/shared/ui/row-actions";

type TagListItem = { id: string; name: string; count: number };

export function TagsPage() {
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagListItem | null>(null);
  const [deletingTag, setDeletingTag] = useState<TagListItem | null>(null);

  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    ...tagsPagedQuery(page, TAGS_PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const deleteTagMutation = useMutation({
    mutationFn: deleteTagFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.all });
      setDeletingTag(null);
    },
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / TAGS_PAGE_SIZE);

  return (
    <PageContent>
      <PageHeader
        title="Tags"
        action={
          <PageActions
            primary={{
              key: "add-tag",
              label: "Add Tag",
              icon: <PlusIcon className="size-4" />,
              onClick: () => setAddOpen(true),
            }}
          />
        }
      />

      {isLoading && <TagListSkeleton />}

      {isError && (
        <ErrorState
          description="We couldn't load your tags."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState>No tags yet. Add your first tag above.</EmptyState>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <DataList
          header={
            <>
              <DataListHead className="flex-1">Tag</DataListHead>
              <DataListHead className="w-16 text-right">Uses</DataListHead>
              <div className="size-8 shrink-0" />
            </>
          }
        >
          {items.map((tag) => (
            <DataListRow key={tag.id}>
              <span className="flex-1 truncate text-sm font-medium">
                {tag.name}
              </span>
              <div className="flex w-16 justify-end">
                <Badge
                  variant="secondary"
                  className="shrink-0 text-xs tabular-nums"
                >
                  {tag.count}
                </Badge>
              </div>
              <RowActions label={`Actions for ${tag.name}`}>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => setEditingTag(tag)}
                >
                  <PencilIcon className="size-4" />
                  Edit
                </DropdownMenuItem>
                {tag.count === 0 && (
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    variant="destructive"
                    onClick={() => setDeletingTag(tag)}
                  >
                    <Trash2Icon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </RowActions>
            </DataListRow>
          ))}
        </DataList>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <AddTagDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {editingTag && (
        <EditTagDialog
          open={!!editingTag}
          onClose={() => setEditingTag(null)}
          tag={editingTag}
        />
      )}

      {deletingTag && (
        <ConfirmDeleteDialog
          open={!!deletingTag}
          onClose={() => setDeletingTag(null)}
          onConfirm={() =>
            deleteTagMutation.mutate({ data: { id: deletingTag.id } })
          }
          title="Delete tag"
          items={[deletingTag.name]}
          isLoading={deleteTagMutation.isPending}
          error={
            deleteTagMutation.isError
              ? "Something went wrong. Please try again."
              : undefined
          }
        />
      )}
    </PageContent>
  );
}
