import { routes } from "@/app/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRightIcon,
  ChartArea,
  ChevronRight,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function AppSidebar() {
  const pathname = usePathname();
  const menus = [
    {
      label: "Dashboard",
      href: routes.dashboard(),
      Icon: ChartArea,
      active: pathname === routes.dashboard(),
    },
    {
      label: "Opérations",
      href: routes.operation(),
      Icon: ArrowLeftRightIcon,
      active: pathname.startsWith(routes.operation()),
    },
    {
      label: "Facturation",
      href: routes.invoice(),
      Icon: Wallet,
      active: pathname.startsWith(routes.invoicePrefix()),
      items: [
        {
          label: "Factures",
          href: routes.invoice(),
          active: pathname.startsWith(routes.invoice()),
        },
        {
          label: "Clients",
          href: routes.client(),
          active: pathname.startsWith(routes.client()),
        },
        {
          label: "Prestataires",
          href: routes.provider(),
          active: pathname.startsWith(routes.provider()),
        },
        {
          label: "Modes de paiement",
          href: routes.paymentMode(),
          active: pathname.startsWith(routes.paymentMode()),
        },
      ],
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Link href={routes.dashboard()}>
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
            {menus.map((el) =>
              el.items ? (
                <Collapsible
                  key={el.label}
                  asChild
                  defaultOpen={el.active}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={el.active}
                        tooltip={el.label}
                      >
                        <el.Icon className="h-4 w-4" />
                        {el.label}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {el.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.label}>
                            <SidebarMenuSubButton asChild isActive={sub.active}>
                              <Link href={sub.href}>{sub.label}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={el.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={el.active}
                    tooltip={el.label}
                  >
                    <Link href={el.href}>
                      <el.Icon className="h-4 w-4" />
                      {el.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>
      <SidebarFooter />
    </Sidebar>
  );
}
