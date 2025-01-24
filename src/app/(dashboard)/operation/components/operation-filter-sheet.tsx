import { FilterSheet } from "@/components/filter-sheet";
import { zd } from "@/lib/zod";
import { ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { AutocompleteField } from "@/components/autocomplete-field";
import { MultiSelectField } from "@/components/multi-select-field";
import { useGetOperations } from "../operation-query";
import { useTags } from "../../tag/tag-query";
import { operationFilterSheetSchema } from "../operation-dto";

export function OperationFilterSheet({
  open,
  onOpenChange,
  onApply,
  value,
}: OperationFilterSheetProps) {
  const operationsFn = useGetOperations({ distinct: "true" });
  const tagsFn = useTags();

  const form = useForm<zd.infer<typeof operationFilterSheetSchema>>({
    resolver: zodResolver(operationFilterSheetSchema),
  });

  useEffect(() => {
    form.reset(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onSubmit = form.handleSubmit((data) => {
    onApply(data);
    onOpenChange(false);
  });

  const onClear = () => {
    form.reset({ label: undefined, tags: [] });
    onApply({ label: undefined, tags: [] });
    onOpenChange(false);
  };

  return (
    <FilterSheet
      open={open}
      onOpenChange={onOpenChange}
      submit={{ onClick: onSubmit }}
      clearAll={{ onClick: onClear }}
    >
      <Form {...form}>
        <form className="grid gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <AutocompleteField
                label="Libellé"
                inputProps={{ placeholder: "Chercher..." }}
                options={
                  operationsFn.data?.results.map((el) => ({
                    value: el.label,
                    label: el.label,
                  })) ?? []
                }
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <MultiSelectField
                label="Tags"
                options={
                  tagsFn.data?.data.results.map((el) => ({
                    value: el.name,
                    label: el.name,
                  })) ?? []
                }
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </form>
      </Form>
    </FilterSheet>
  );
}

type OperationFilterSheetProps = Pick<
  ComponentProps<typeof FilterSheet>,
  "open" | "onOpenChange"
> & {
  onApply: (data: zd.infer<typeof operationFilterSheetSchema>) => void;
  value: zd.infer<typeof operationFilterSheetSchema>;
};
