"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export interface GenericButton {
  label: string                     // Button text
  icon?: ReactNode                   // Optional icon
  variant?: "default" | "outline" | "destructive" | "secondary"
  action: string                     // Action identifier like 'add', 'edit', 'invite'
  disabled?: boolean                 // Optional disable state
  className?: string                 // Optional custom classes
}

interface GenericPrimaryButtonsProps {
  buttons: GenericButton[]
  onAction: (action: string) => void
}

export function GenericPrimaryButtons({ buttons, onAction }: GenericPrimaryButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <Button
          key={btn.action}
          variant={btn.variant ?? "default"}
          disabled={btn.disabled}
          className={cn("space-x-1", btn.className)}
          onClick={() => onAction(btn.action)}
        >
          <span>{btn.label}</span>
          {btn.icon && btn.icon}
        </Button>
      ))}
    </div>
  )
}
