import { FilterSheet } from "@/components/filter-sheet";
import { zd } from "@/lib/zod";
import { ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { defaultGetStatsQuery, getStatsQuerySchema } from "../stat-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { MonthPickerField } from "@/components/month-picker-field";

export function StatFilterSheet({
  open,
  onOpenChange,
  onApply,
  value,
}: StatFilterSheetProps) {
  const form = useForm<zd.infer<typeof getStatsQuerySchema>>({
    resolver: zodResolver(getStatsQuerySchema),
  });

  useEffect(() => {
    form.reset(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.range.from, value.range.to]);

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
            name="range"
            render={({ field, formState }) => (
              <MonthPickerField
                type="range"
                label="Date de création"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                error={formState.errors.range}
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
