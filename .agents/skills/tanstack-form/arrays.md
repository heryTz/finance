# TanStack Form v2 — Arrays

For composition patterns (`withForm`, `withFieldGroup`) see [composition.md](composition.md).

## Rules

1. Add `mode="array"` on the parent `form.AppField`
2. Sub-fields use `form.AppField` with indexed name: `` name={`items[${i}].field`} ``
3. Inside sub-field render, use registered field components — no raw `<input>`
4. Array default value goes in `formOptions()` — never outside
5. Add items with `field.pushValue`, remove with `field.removeValue(i)`
6. Schema lives in the form file — validate array shape with `z.array(...)`
7. Use `key={item.id}` when items have stable IDs; fall back to `key={i}` only for append-only lists

## Pattern

```tsx
const opts = formOptions({
  defaultValues: {
    people: [] as Array<{ name: string; age: number }>,
  },
});

const schema = z.object({
  people: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      age: z.number().min(0, "Age must be positive"),
    }),
  ).min(1, "Add at least one person"),
});
```

Parent field with `mode="array"`, sub-fields via `form.AppField`:

```tsx
<form.AppField name="people" mode="array">
  {(field) => (
    <div>
      {field.state.value.map((_, i) => (
        <div key={i}>
          <form.AppField name={`people[${i}].name`}>
            {(subField) => <subField.InputField label={`Name ${i + 1}`} required />}
          </form.AppField>
          <form.AppField name={`people[${i}].age`}>
            {(subField) => <subField.InputField label="Age" type="number" />}
          </form.AppField>
          <button type="button" onClick={() => field.removeValue(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => field.pushValue({ name: "", age: 0 })}>
        Add person
      </button>
    </div>
  )}
</form.AppField>
```

## Array Manipulation Methods

| Method | Description |
|---|---|
| `field.pushValue(item)` | Append an item |
| `field.removeValue(i)` | Remove by index |
| `field.swapValues(i, j)` | Swap two items |
| `field.moveValue(from, to)` | Move item to a new index |

## Full Example

```tsx
import { formOptions } from "@tanstack/react-form";
import { z } from "zod";
import { useAppForm } from "./form-setup";

const schema = z.object({
  people: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      age: z.number().min(0, "Age must be positive"),
    }),
  ).min(1, "Add at least one person"),
});

const opts = formOptions({
  defaultValues: {
    people: [] as Array<{ name: string; age: number }>,
  },
});

export function PeopleForm() {
  const form = useAppForm({
    ...opts,
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => mutation.mutate({ data: value }),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="people" mode="array">
        {(field) => (
          <div>
            {field.state.value.map((_, i) => (
              <div key={i}>
                <form.AppField name={`people[${i}].name`}>
                  {(subField) => <subField.InputField label={`Name ${i + 1}`} required />}
                </form.AppField>
                <form.AppField name={`people[${i}].age`}>
                  {(subField) => <subField.InputField label="Age" type="number" />}
                </form.AppField>
                <button type="button" onClick={() => field.removeValue(i)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => field.pushValue({ name: "", age: 0 })}>
              Add person
            </button>
          </div>
        )}
      </form.AppField>

      {mutation.isError && <p className="text-sm text-destructive">Something went wrong.</p>}

      <form.AppForm>
        <form.SubmitButton isLoading={mutation.isPending}>Submit</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
```

## Combining with withFieldGroup

When array items share structure across multiple forms, mount a `withFieldGroup` component at each index:

```tsx
<form.AppField name="accounts" mode="array">
  {(field) => (
    <div>
      {field.state.value.map((_, i) => (
        <PasswordGroup key={i} form={form} fields={`accounts[${i}]`} title={`Account ${i + 1}`} />
      ))}
      <button type="button" onClick={() => field.pushValue({ password: "", confirm_password: "" })}>
        Add account
      </button>
    </div>
  )}
</form.AppField>
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| `mode="array"` omitted | Add `mode="array"` to the parent `form.AppField` |
| Raw `<input>` inside array item | Use a registered field component via `subField.InputField` |
| `form.Field` instead of `form.AppField` | Always use `form.AppField` |
| Array default outside `formOptions` | Move into `formOptions({ defaultValues: { items: [] } })` |
| Missing `key` on item wrapper | Add `key={item.id}` or `key={i}` |
| Mutating `field.state.value` directly | Use `pushValue` / `removeValue` / `swapValues` / `moveValue` |
