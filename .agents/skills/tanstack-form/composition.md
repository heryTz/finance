# TanStack Form v2 — Composition Patterns

`withForm` and `withFieldGroup` are exported from `createFormHook` in `form-setup.ts`.

---

## withForm — Splitting Large Forms

Breaks a form into typed section components. The sub-component receives the parent `form` instance via prop — no generic parameters needed, full type safety.

Use `formOptions()` to define defaults once and spread into both the parent and the sub-component. This is the only safe way to keep them in sync.

```tsx
// form-opts.ts — shared between parent form and sub-components
import { formOptions } from "@tanstack/react-form";

export const profileOpts = formOptions({
  defaultValues: { firstName: "", lastName: "", bio: "" },
});
```

```tsx
// personal-section.tsx
import { withForm } from "./form-setup";
import { profileOpts } from "./form-opts";

export const PersonalSection = withForm({
  ...profileOpts,
  props: { title: "" as string },
  render: function Render({ form, title }) {
    return (
      <div>
        <h2>{title}</h2>
        <form.AppField name="firstName">{(field) => <field.InputField label="First Name" />}</form.AppField>
        <form.AppField name="lastName">{(field) => <field.InputField label="Last Name" />}</form.AppField>
      </div>
    );
  },
});
```

```tsx
// profile-form.tsx
import { z } from "zod";
import { useAppForm } from "./form-setup";
import { profileOpts } from "./form-opts";
import { PersonalSection } from "./personal-section";

const schema = z.object({
  firstName: z.string().min(1, "i18n:validation.required"),
  lastName: z.string().min(1, "i18n:validation.required"),
  bio: z.string(),
});

const form = useAppForm({
  ...profileOpts,
  validators: { onSubmit: schema },
  onSubmit: ({ value }) => mutation.mutate({ data: value }),
});

<form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
  <PersonalSection form={form} title="Personal Info" />
  <form.AppForm>
    <form.SubmitButton isLoading={mutation.isPending}>Submit</form.SubmitButton>
  </form.AppForm>
</form>
```

---

## withFieldGroup — Reusable Field Groups

Scopes a set of related fields that can be mounted at different locations across multiple forms. Use `group.AppField` (not `form.AppField`) inside the render function.

```tsx
// password-group.tsx
import { withStore } from "@tanstack/react-store";
import { withFieldGroup } from "./form-setup";

type PasswordFields = { password: string; confirm_password: string };

export const PasswordGroup = withFieldGroup({
  defaultValues: { password: "", confirm_password: "" } satisfies PasswordFields,
  props: { title: "" as string },
  render: function Render({ group, title }) {
    return (
      <div>
        <h2>{title}</h2>
        <group.AppField name="password">
          {(field) => <field.InputField label="Password" type="password" />}
        </group.AppField>
        <group.AppField
          name="confirm_password"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value }) =>
              value !== group.getFieldValue("password")
                ? "i18n:validation.passwordMismatch"
                : undefined,
          }}
        >
          {(field) => <field.InputField label="Confirm Password" type="password" />}
        </group.AppField>
      </div>
    );
  },
});
```

> **Reactive rendering inside render:** `group.getFieldValue` is fine in validators (called on change). To reactively display a group field value in the JSX — e.g., a password strength meter — use `useStore` instead:
>
> ```tsx
> import { useStore } from "@tanstack/react-store";
> const password = useStore(group.store, (s) => s.values.password);
> ```

### Mounting options

```tsx
// Nested object — group fields live under account_data.*
<PasswordGroup form={form} fields="account_data" title="Account Password" />

// Array item
{accounts.map((a, i) => (
  <PasswordGroup key={a.id} form={form} fields={`linked_accounts[${i}]`} title={a.provider} />
))}

// Explicit field map — group fields map to top-level form keys
<PasswordGroup
  form={form}
  fields={{ password: "password", confirm_password: "confirm_password" }}
  title="Password"
/>

// Auto-map top-level keys
import { createFieldMap } from "@tanstack/react-form";
<PasswordGroup form={form} fields={createFieldMap({ password: "", confirm_password: "" })} title="Password" />
```

---

## extendForm — Platform Team Pattern

Publish a base form config from a shared package; downstream teams add their own fields without duplicating upstream setup.

```ts
// packages/ui/src/form-setup.ts  (upstream)
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { InputField } from "./fields/input-field";
import { SubmitButton } from "./components/submit-button";

const PlatformForm = createFormHook({
  fieldContext, formContext,
  fieldComponents: { InputField },
  formComponents: { SubmitButton },
});

export default PlatformForm;
export { useFieldContext, useFormContext } from "./form-context";
```

```ts
// apps/my-app/src/form-setup.ts  (downstream)
import PlatformForm from "@company/ui/form-setup";
import { DateField } from "./fields/date-field";

export const { useAppForm, withForm, withFieldGroup } = PlatformForm.extendForm({
  fieldComponents: { DateField },
  formComponents: {},
});

export { useFieldContext } from "@company/ui/form-setup";
```

---

## Tree-shaking — Lazy Field Components

For forms with heavy field components (rich text editors, map pickers, etc.), lazy-load them to keep the initial bundle small.

```ts
// form-setup.ts
import { lazy } from "react";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { SubmitButton } from "./submit-button";

const RichTextField = lazy(() => import("./fields/rich-text-field"));

export const { useAppForm, withForm } = createFormHook({
  fieldContext, formContext,
  fieldComponents: { RichTextField },
  formComponents: { SubmitButton },
});
```

```tsx
// route or page component
import { Suspense } from "react";

<Suspense fallback={<p>Loading…</p>}>
  <MyForm />
</Suspense>
```
