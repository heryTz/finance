import { PropsWithChildren } from "react";

export function Container({ title, children }: ContainerProps) {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      </div>
      {children}
    </>
  );
}

type ContainerProps = PropsWithChildren<{
  title: string;
}>;
