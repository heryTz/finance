import { PropsWithChildren, ReactNode } from "react";
import { Button, ButtonProps } from "./ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./ui/credenza";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  submit,
  cancel,
  trigger,
  children,
}: ModalProps) {
  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {trigger && <CredenzaTrigger asChild>{trigger}</CredenzaTrigger>}
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          {description && (
            <CredenzaDescription>{description}</CredenzaDescription>
          )}
        </CredenzaHeader>
        <CredenzaBody>{children}</CredenzaBody>
        <CredenzaFooter>
          {cancel && (
            <Button variant={"outline"} {...cancel}>
              {cancel.children ?? "Fermer"}
            </Button>
          )}
          {submit && (
            <Button variant={"default"} {...submit}>
              {submit.children ?? "Valider"}
            </Button>
          )}
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

type ModalProps = PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  title: string;
  description?: ReactNode;
  submit?: ButtonProps;
  cancel?: ButtonProps;
  trigger?: ReactNode;
}>;
