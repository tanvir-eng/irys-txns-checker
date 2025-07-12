"use client"

import React, { ReactNode } from "react"
import clsx from "clsx"

export function Alert({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("flex items-start gap-2 rounded-md border p-4", className)}>{children}</div>
}

export function AlertDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("flex-1 text-sm leading-tight", className)}>{children}</div>
}
