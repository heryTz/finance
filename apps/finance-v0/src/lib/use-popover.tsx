import { useRef, useState } from "react";

export function usePopover<T extends Element>() {
  const [open, setOpen] = useState(false);
  const anchor = useRef<T>(null);
  return { open, setOpen, anchor };
}
