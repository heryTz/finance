import { Coins } from "lucide-react";

export function Logo({}: LogoProps) {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold">
      <Coins className="h-6 w-6" />
      <span>Finance</span>
    </div>
  );
}

type LogoProps = {
  className?: string;
};
