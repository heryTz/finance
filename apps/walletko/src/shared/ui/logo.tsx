import { type SVGProps, useId } from "react";

import { cn } from "src/shared/lib/utils";

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  const id = useId();
  const tile = `${id}-tile`;
  const glass = `${id}-glass`;
  const sheen = `${id}-sheen`;

  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Walletko"
      className={cn("size-7", className)}
      {...props}
    >
      <defs>
        <linearGradient id={tile} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="0.55" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="28"
        fill={`url(#${tile})`}
      />
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="28"
        fill={`url(#${sheen})`}
        opacity="0.35"
      />
      <g transform="translate(0 -5)">
        <rect
          x="26"
          y="40"
          width="68"
          height="50"
          rx="15"
          fill={`url(#${glass})`}
          stroke="#ffffff"
          strokeOpacity="0.7"
          strokeWidth="1.5"
        />
        <path
          d="M26 55 A15 15 0 0 1 41 40 L79 40 A15 15 0 0 1 94 55 L94 57 L26 57 Z"
          fill="#ffffff"
          fillOpacity="0.22"
        />
        <rect
          x="36"
          y="69"
          width="30"
          height="6"
          rx="3"
          fill="#ffffff"
          fillOpacity="0.75"
        />
        <circle cx="80" cy="72" r="9" fill="#ffffff" fillOpacity="0.9" />
        <circle cx="80" cy="72" r="4" fill="#4f46e5" fillOpacity="0.5" />
      </g>
    </svg>
  );
}
