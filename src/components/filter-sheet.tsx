import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";

export function FilterSheet({
  title,
  description,
  open,
  submit,
  onOpenChange,
  children,
  clearAll,
  disableOpenAutoFocus,
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex flex-col sm:max-w-[500px] p-4"
        onOpenAutoFocus={
          disableOpenAutoFocus ? (e) => e.preventDefault() : undefined
        }
      >
        <SheetHeader className="p-2">
          <SheetTitle>{title ?? "Ajouter des filtres"}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-auto p-2">{children}</div>
        <SheetFooter className=" gap-2 sm:gap-4 p-2">
          <Button {...clearAll} variant={"outline"}>
            Tout effacer
          </Button>
          <Button {...submit}>{submit.children ?? "Appliquer"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type FilterSheetProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: ReactNode;
  submit: ComponentProps<typeof Button>;
  clearAll: ComponentProps<typeof Button>;
  disableOpenAutoFocus?: boolean;
}>;
