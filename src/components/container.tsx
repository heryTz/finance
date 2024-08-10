import { PropsWithChildren, ReactNode } from "react";

export function Container({ action, title, children }: ContainerProps) {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        {action}
      </div>
      {children}
    </>
  );
}

type ContainerProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>;
