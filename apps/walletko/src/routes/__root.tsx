import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getAppMetaFn } from "src/server/functions/app-meta.fn";
import { NotFound } from "src/shared/components/not-found";
import { queryClient } from "src/shared/lib/query-client";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  loader: () => getAppMetaFn(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Walletko" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootDocument,
});

const themeInitScript = `(function(){try{var m=localStorage.getItem('theme');var d=m==='dark'||((m===null||m==='auto')&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

function RootDocument({ children }: { children: React.ReactNode }) {
  const { version } = Route.useLoaderData();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: pre-existing theme-init script; content is a static string defined in this file, not user input */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body data-app-version={version} className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}
