import { GithubIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";

export function NavSecondary(props: NavSecondaryProps) {
  const { setOpenMobile } = useSidebar();
  const menus = [
    {
      label: "GitHub",
      href: "https://github.com/heryTz/finance",
      Icon: GithubIcon,
      target: "_blank",
    },
  ];

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {menus.map((el) => (
            <SidebarMenuItem key={el.label}>
              <SidebarMenuButton
                asChild
                tooltip={el.label}
                onClick={() => setOpenMobile(false)}
              >
                <Link href={el.href} target={el.target}>
                  <el.Icon className="h-4 w-4" />
                  {el.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

type NavSecondaryProps = React.ComponentPropsWithoutRef<typeof SidebarGroup>;
