import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { XIcon } from "lucide-react";
import {
  ComponentProps,
  createContext,
  forwardRef,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import ReactModalPrimitive from "react-modal";

ReactModalPrimitive.setAppElement("#ReactModalPortal");

type ReactModalRootProps = {
  labelledby?: string;
  describeby?: string;
  open: boolean;
  onOpenChange: (b: boolean) => void;
};

const ReactModalContext = createContext<ReactModalRootProps>({
  open: false,
  onOpenChange: () => {},
});

export const ReactModal = ({
  children,
  ...props
}: PropsWithChildren<
  Partial<Pick<ReactModalRootProps, "open" | "onOpenChange">>
>) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const onOpenChange = (b: boolean) => {
    setOpen(b);
    props.onOpenChange?.(b);
  };

  return (
    <ReactModalContext.Provider
      value={{
        open,
        onOpenChange,
        labelledby: `react-modal-title:${id}`,
        describeby: `react-modal-description:${id}`,
      }}
    >
      {children}
    </ReactModalContext.Provider>
  );
};

export const ReactModalClose = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  }
>(({ asChild, ...props }, ref) => {
  const context = useContext(ReactModalContext);
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      onClick={() => {
        context.onOpenChange(false);
      }}
      {...props}
    />
  );
});

ReactModalClose.displayName = "ReactModalClose";

export const ReactModalContent = forwardRef<
  ReactModalPrimitive,
  PropsWithChildren<{ className?: string }>
>(({ className, ...props }, ref) => {
  const context = useContext(ReactModalContext);
  return (
    <ReactModalPrimitive
      ref={ref}
      overlayClassName={
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      }
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg focus-visible:outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      aria={{
        labelledby: context.labelledby,
        describedby: context.describeby,
      }}
      {...props}
      isOpen={!!context.open}
      onRequestClose={() => context.onOpenChange(false)}
      data-open={context.open ? "open" : "closed"}
    >
      {props.children}
      <ReactModalClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ReactModalClose>
    </ReactModalPrimitive>
  );
});

ReactModalContent.displayName = "ReactModalContent";

export const ReactModalBody = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};
export const ReactModalHeader = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
});

ReactModalHeader.displayName = "ReactModalHeader";

export const ReactModalTitle = forwardRef<
  HTMLHeadingElement,
  ComponentProps<"h2">
>(({ className, ...props }, ref) => {
  const { labelledby } = useContext(ReactModalContext);
  return (
    <h2
      ref={ref}
      id={labelledby}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
});

ReactModalTitle.displayName = "ReactModalTitle";

export const ReactModalFooter = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
});

ReactModalFooter.displayName = "ReactModalFooter";

export const ReactModalDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(({ className, ...props }, ref) => {
  const { describeby } = useContext(ReactModalContext);
  return (
    <p
      ref={ref}
      id={describeby}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

ReactModalDescription.displayName = "ReactModalDescription";

export const ReactModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  }
>(({ asChild, ...props }, ref) => {
  const context = useContext(ReactModalContext);
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      onClick={() => {
        context.onOpenChange(!context.open);
      }}
      {...props}
    />
  );
});

ReactModalTrigger.displayName = "ReactModalTrigger";
