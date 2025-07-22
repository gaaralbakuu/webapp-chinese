"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  variant = "default",
  ...props
}) {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600",
    success: "bg-gradient-to-r from-green-500 to-emerald-600", 
    warning: "bg-gradient-to-r from-orange-500 to-amber-600",
    danger: "bg-gradient-to-r from-red-500 to-pink-600"
  };

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          variants[variant] || variants.default
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress }
