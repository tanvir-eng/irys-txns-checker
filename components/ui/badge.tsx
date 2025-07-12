"use client"

import React, { ReactNode } from "react"
import clsx from "clsx"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "secondary"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const base = "inline-block rounded-full px-3 py-1 text-xs font-semibold"
  const variants = {
    default: "bg-gray-200 text-gray-800",
    secondary: "bg-indigo-200 text-indigo-800",
  }

  return <span className={clsx(base, variants[variant], className)}>{children}</span>
}
