import { XIcon } from "lucide-react";
import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useEffect,
  useId,
  useState,
} from "react";
import ReactModalPrimitive from "react-modal";

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

const ReactModalRoot = ({
  children,
  ...props
}: PropsWithChildren<ReactModalRootProps>) => {
  const [value, setValue] = useState<ReactModalRootProps>(props);
  const id = useId();

  useEffect(() => {
    setValue(props);
  }, [props]);

  return (
    <ReactModalContext.Provider
      value={{
        ...value,
        labelledby: `react-modal-title:${id}`,
        describeby: `react-modal-description:${id}`,
      }}
    >
      {children}
    </ReactModalContext.Provider>
  );
};

export function ReactModalContent(
  props: ComponentProps<typeof ReactModalPrimitive>,
) {
  return (
    <ReactModalPrimitive
      overlayClassName={
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      }
      className={
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
      }
      {...props}
    >
      {props.children}
      <button
        onClick={props.onRequestClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </ReactModalPrimitive>
  );
}

export function ReactModalHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
      {children}
    </div>
  );
}

export function ReactModalTitle({ children }: PropsWithChildren) {
  return (
    <div className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </div>
  );
}

export function ReactModalFooter(props: PropsWithChildren) {
  return (
    <div
      className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
      {...props}
    />
  );
}
