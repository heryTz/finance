import { FilterSheet } from "@/components/filter-sheet";
import { zd } from "@/lib/zod";
import { ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { defaultGetStatsQuery, getStatsQuerySchema } from "../stat-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { AutocompleteField } from "@/components/autocomplete-field";
import { MultiSelectField } from "@/components/multi-select-field";
import { useGetOperations } from "../../operation/operation-query";
import { useTags } from "../../tag/tag-query";

export function StatFilterSheet({
  open,
  onOpenChange,
  onApply,
  value,
}: StatFilterSheetProps) {
  const operationsFn = useGetOperations({ distinct: "true" });
  const tagsFn = useTags();

  const form = useForm<zd.infer<typeof getStatsQuerySchema>>({
    resolver: zodResolver(getStatsQuerySchema),
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
    form.reset(defaultGetStatsQuery);
    onApply(defaultGetStatsQuery);
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

type StatFilterSheetProps = Pick<
  ComponentProps<typeof FilterSheet>,
  "open" | "onOpenChange"
> & {
  onApply: (data: zd.infer<typeof getStatsQuerySchema>) => void;
  value: zd.infer<typeof getStatsQuerySchema>;
};
