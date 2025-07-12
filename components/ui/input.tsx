"use client"

import React, { InputHTMLAttributes } from "react"
import clsx from "clsx"

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none"
      )}
      {...props}
    />
  )
}
