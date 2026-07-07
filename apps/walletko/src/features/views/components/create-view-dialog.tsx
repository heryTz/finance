import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { tagsQuery } from "src/features/tags/queries";
import { viewKeys } from "src/features/views/queries";
import { createViewFn } from "src/server/functions/views.fn";
import { useAppForm } from "src/shared/form/form-setup";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Button } from "src/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/shared/ui/dialog";
import { z } from "zod";

type Props = {
  open: boolean;
  onClose: () => void;
};

const comboboxOptionSchema = z.object({ value: z.string(), label: z.string() });

const saveViewSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string(),
  nameFilter: z.string(),
  tags: z.array(comboboxOptionSchema),
});

export function CreateViewDialog({ open, onClose }: Props) {
  const formId = useId();
  const qc = useQueryClient();

  const { data: tagSuggestions = [] } = useQuery(tagsQuery);
  const tagOptions = tagSuggestions.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const mutation = useMutation({
    mutationFn: (payload: {
      name: string;
      description?: string;
      nameFilter?: string;
      tagIds: string[];
    }) => createViewFn({ data: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: viewKeys.list() });
      onClose();
    },
  });

  const f = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      nameFilter: "",
      tags: [] as z.infer<typeof comboboxOptionSchema>[],
    },
    validators: { onSubmit: saveViewSchema },
    onSubmit: ({ value }) => {
      mutation.mutate({
        name: value.name,
        description: value.description || undefined,
        nameFilter: value.nameFilter || undefined,
        tagIds: value.tags.map((t) => t.value),
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: i know what i do
  useEffect(() => {
    if (open) {
      f.reset();
      mutation.reset();
    }
  }, [open]);

  const errorMessage = mutation.isError
    ? mutation.error?.message === "name_conflict"
      ? "A view with this name already exists."
      : "Something went wrong. Please try again."
    : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          f.handleSubmit();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <f.AppField name="name">
              {(field) => (
                <field.InputField
                  label="Name"
                  placeholder="e.g. Food & Dining"
                />
              )}
            </f.AppField>
            <f.AppField name="description">
              {(field) => (
                <field.InputField
                  label="Description"
                  placeholder="Optional description"
                />
              )}
            </f.AppField>
            <f.AppField name="nameFilter">
              {(field) => (
                <field.InputField
                  label="Name filter"
                  placeholder="e.g. Grocery"
                />
              )}
            </f.AppField>
            <f.AppField name="tags">
              {(field) => (
                <field.ComboboxField
                  label="Tags"
                  options={tagOptions}
                  placeholder="Add tags…"
                  searchPlaceholder="Search tag…"
                  emptyText="No tags found."
                />
              )}
            </f.AppField>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <f.AppForm>
              <f.SubmitButton form={formId} isLoading={mutation.isPending}>
                Create View
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
