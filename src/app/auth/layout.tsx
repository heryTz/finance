import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
