"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useMagneticHover } from "@/hooks/useMagneticHover";

type MagneticGoldButtonProps = ComponentPropsWithoutRef<"a">;

export function MagneticGoldButton({ className = "", ...props }: MagneticGoldButtonProps) {
  const ref = useMagneticHover<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      className={`focus-ring inline-flex h-11 items-center justify-center rounded-sm bg-[var(--gold-bright)] px-5 text-sm font-semibold text-[var(--bg-deep)] transition-[background-color,box-shadow] duration-200 will-change-transform hover:bg-[var(--gold)] hover:shadow-[0_8px_28px_rgba(232,168,32,0.22)] ${className}`}
      {...props}
    />
  );
}
