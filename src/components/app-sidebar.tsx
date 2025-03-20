import { routes } from "@/app/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Logo } from "./logo";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Link href={routes.dashboard()}>
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
