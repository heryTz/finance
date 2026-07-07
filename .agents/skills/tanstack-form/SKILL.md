---
name: tanstack-form
description: Create or modify forms using TanStack Form's composition API. Uses formOptions() as the form shape primitive, withForm HOC for decomposing large forms into sections, withFieldGroup for reusable field groups across forms, Zod for validation, and i18n-prefixed error messages. Use when creating or modifying forms in the web app.
---

# TanStack Form v2

For initial setup see [setup.md](setup.md). For `withForm`, `withFieldGroup`, and `extendForm` see [composition.md](composition.md). For array fields see [arrays.md](arrays.md).

## Rules

1. Define form shape with `formOptions()` — share it into `useAppForm` and any `withForm` sub-components via spread
2. Schemas live in the form file (or a sibling `schema.ts`), never inside field components
3. Field components are dumb UI wrappers — they own no schema knowledge and no defaults
4. `onSubmit` only calls `mutation.mutate` — side effects go in `useMutation` callbacks
5. Wrap `form.SubmitButton` in `form.AppForm`
6. Zod error messages: prefix with `"i18n:"` if project uses i18n (check `package.json` for `react-i18next`)
7. Forms with 3+ distinct sections → split with `withForm` HOC
8. Field groups reused across multiple forms → `withFieldGroup` HOC
9. `render` in `withForm`/`withFieldGroup` must be a named function, not an arrow function (ESLint hooks rule)

## Form Shape

`formOptions()` is the canonical primitive. Define it once; spread into `useAppForm` (and into `withForm` sub-components — see [composition.md](composition.md)).

```tsx
import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "i18n:validation.required"),
  email: z.string().email("i18n:validation.email"),
});

const opts = formOptions({
  defaultValues: { name: "", email: "" },
});

// ---

const mutation = useMutation({
  mutationFn: myServerFn,
  onSuccess: () => { /* redirect, invalidate */ },
});

const form = useAppForm({
  ...opts,
  validators: { onSubmit: schema },
  onSubmit: ({ value }) => mutation.mutate({ data: value }),
});
```

```tsx
<form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
  <form.AppField name="name">{(field) => <field.InputField label="Name" />}</form.AppField>
  <form.AppField name="email">{(field) => <field.InputField label="Email" type="email" />}</form.AppField>
  {mutation.isError && <p className="text-sm text-destructive">Something went wrong.</p>}
  <form.AppForm>
    <form.SubmitButton isLoading={mutation.isPending}>Submit</form.SubmitButton>
  </form.AppForm>
</form>
```

## Adding a Field

Field components are pure UI. They read from context, render the input, show errors. They know nothing about schemas or defaults.

**1. Create `<name>-field.tsx` — import `useFieldContext` from `form-context`, not `form-setup`**

```tsx
import { useFieldContext } from "../form-context";
import { useFormatError } from "src/lib/use-format-error";

export function MyField({ label, ...props }: { label: string } & Omit<ComponentProps<typeof UiComp>, "value" | "onChange" | "onBlur">) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid ? undefined : formatError(field.state.meta.errors);
  return (
    <FormField label={label} error={error}>
      <UiComp {...props} id={field.name} value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} aria-invalid={!!error || undefined} />
    </FormField>
  );
}
```

**2. Register in `form-setup.ts` `fieldComponents`**

**3. Use at call site — all UI props go here, never inside the field component**

```tsx
<form.AppField name="x">{(field) => <field.MyField label="X" placeholder="…" />}</form.AppField>
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Schema or defaults inside a field component | Move to the form file |
| `const defaultValues = {}` outside `useAppForm` | Use `formOptions()` |
| Duplicating `defaultValues` in parent and `withForm` | Spread `opts` in both |
| Server call in `onSubmit` | `useMutation`, call `mutation.mutate` in `onSubmit` |
| `SubmitButton` unwrapped | Wrap in `form.AppForm` |
| Field imports `useFieldContext` from `form-setup` | Import from `form-context` (avoids circular dep) |
| Arrow fn in `withForm`/`withFieldGroup` render | Named fn: `render: function Render({…}) {}` |
| Missing `stopPropagation` | Add both `preventDefault` + `stopPropagation` |
