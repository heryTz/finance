# CLAUDE.md

- Never use Tailwind palette color classes (e.g. `bg-green-500`, `text-sky-600`, `text-emerald-*`) in components. Every color must come from a semantic CSS token registered in `@theme inline` (e.g. `bg-income-subtle`, `text-transfer`, `bg-destructive-subtle`). Dark mode is handled by swapping token values in `.dark {}` — never use `dark:` prefixes on color classes.
- Do not add comments to code unless they are very useful (i.e. the logic is non-obvious and cannot be made self-evident by better naming).
- Prefer `type` over `interface` unless the shape will be implemented by a class (`implements`).
- Always define Zod schemas as named constants above the component that uses them, never inline in JSX or validators.
- Inside React components, prefer arrow functions over `function` declarations for handlers and callbacks.
- Always use existing UI components (e.g. `Button`, `Input`) instead of raw HTML elements when an equivalent exists. If an elementary, reusable piece of UI has no existing component, create one rather than inlining raw markup.
- Build on shadcn/ui components and its design system as much as possible. Prefer adding/composing shadcn/ui primitives over hand-rolling new ones, and follow shadcn/ui conventions (composition, variants via `cva`, the `cn` helper) when extending them.
