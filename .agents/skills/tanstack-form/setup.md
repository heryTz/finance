# TanStack Form v2 — Setup

## Before You Start

- **Monorepo / workspace?** Look for a dedicated UI package (`packages/ui`, `libs/ui`). Field components and `use-format-error` may belong there. Check if an upstream form config already exists before creating one — use `extendForm` if so (see [composition.md](composition.md)).
- **Existing form setup?** Check if `form-context.ts`, `form-setup.ts`, or field components already exist — extend them rather than recreating.
- **Button component?** Locate the project's `Button` before writing `SubmitButton`.
- **i18n?** Check `package.json` for `react-i18next`. If present, prefix Zod error strings with `"i18n:"`.

Adapt all file paths to match the project's actual structure.

## Install

```bash
pnpm add @tanstack/react-form zod
```

Add i18n packages only if the project already uses them:

```bash
pnpm add react-i18next i18next
```

## File Layout

Two files instead of one keeps field components free of circular dependency on the hook:

```
src/components/form/
├── form-context.ts      ← contexts only; field components import from here
├── form-setup.ts        ← hook creation; imports from form-context
├── submit-button.tsx
├── input-field.tsx
└── …
src/lib/
└── use-format-error.ts
```

## `form-context.ts`

```ts
import { createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
```

## `form-setup.ts`

```ts
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { InputField } from "./input-field";
import { SubmitButton } from "./submit-button";
// import other fields as needed…

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField /*, OtherField */ },
  formComponents: { SubmitButton },
});
```

> **Tree-shaking:** For forms that load heavy field components, wrap imports in `React.lazy` before passing them to `fieldComponents`. Wrap the form in `<Suspense>` at the route level.
>
> ```ts
> import { lazy } from "react";
> const RichTextField = lazy(() => import("./rich-text-field"));
> ```

## `use-format-error.ts`

Messages prefixed `"i18n:"` are translated via the `zod` namespace; plain strings are shown as-is.

```ts
import { useTranslation } from "react-i18next";

export function useFormatError() {
  const { t } = useTranslation("zod");
  const fmt = (msg: string) =>
    msg.startsWith("i18n:") ? t(msg.replace("i18n:", "")) : msg;
  return (issues: unknown): string => {
    if (!issues) return "Unknown error";
    if (Array.isArray(issues))
      return issues.map((i) =>
        typeof i === "string" ? fmt(i)
        : i && typeof i === "object" && "message" in i ? fmt((i as { message: string }).message)
        : "Unknown error"
      ).join(", ");
    if (typeof issues === "object" && "message" in issues)
      return fmt((issues as { message: string }).message);
    return fmt(issues as string);
  };
}
```

Without i18n: drop the `useTranslation` import and replace `t(key)` with `key` (the `"i18n:"` prefix is already stripped by `replace`).

## `submit-button.tsx`

```tsx
import { ComponentProps } from "react";
import { Button } from "../ui/button"; // adapt to project
import { useFormContext } from "./form-context";
import { Loader2Icon } from "lucide-react";

type SubmitButtonProps = ComponentProps<typeof Button> & { isLoading?: boolean };

export function SubmitButton({ children, className, isLoading, ...props }: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" className={className} {...props} disabled={isSubmitting || isLoading}>
          {(isSubmitting || isLoading) && <Loader2Icon className="animate-spin" />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
```

## Field Component Pattern

Field components import `useFieldContext` from `form-context`, not `form-setup` — this avoids circular dependencies.

```tsx
import { useFieldContext } from "./form-context";
import { useFormatError } from "src/lib/use-format-error";

export function InputField({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & Omit<ComponentProps<"input">, "value" | "onChange" | "onBlur">) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid ? undefined : formatError(field.state.meta.errors);

  return (
    <div>
      <label htmlFor={field.name}>{label}{required && " *"}</label>
      <input
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={!!error || undefined}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
```

Register in `form-setup.ts` `fieldComponents`, then use:

```tsx
<form.AppField name="email">
  {(field) => <field.InputField label="Email" type="email" required />}
</form.AppField>
```
