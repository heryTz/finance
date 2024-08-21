import { PropsWithChildren, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function AppTooltip({ content, children }: AppTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="text-xs">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type AppTooltipProps = PropsWithChildren<{
  content: ReactNode;
}>;
