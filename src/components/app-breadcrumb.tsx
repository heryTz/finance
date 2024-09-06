import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

export function AppBreadcrumb({ links }: AppBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => {
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {link.path ? (
                  <BreadcrumbLink asChild>
                    <Link href={link.path}>
                      {link.path === "/" ? (
                        <HomeIcon className="w-4 h-4" />
                      ) : (
                        link.label
                      )}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < links.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type AppBreadcrumbProps = {
  links: Array<{ label: string; path?: string }>;
};
