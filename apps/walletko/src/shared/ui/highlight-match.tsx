import { cn } from "src/shared/lib/utils";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightMatch({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const trimmed = query.trim();
  if (!trimmed) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"));
  const lowerQuery = trimmed.toLowerCase();

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === lowerQuery ? (
          <mark
            // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional and stable
            key={index}
            className={cn(
              "rounded-[3px] bg-highlight px-0.5 text-highlight-foreground",
              className,
            )}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
