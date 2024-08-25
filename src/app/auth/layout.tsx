import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh">
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto h-[60px] px-4 lg:px-6 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant={"ghost"}
              size={"icon"}
              className="rounded-full"
            >
              <Link href={"https://github.com/heryTz/finance"} target="_blank">
                <GithubIcon />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-[calc(100dvh_-_60px)]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
