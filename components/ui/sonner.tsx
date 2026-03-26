"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass-card group-[.toaster]:border-card-border group-[.toaster]:shadow-lg group-[.toaster]:text-foreground",
          description: "group-[.toast]:text-muted-foreground font-light",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-red-500/10 group-[.toaster]:text-red-200",
          success: "group-[.toaster]:border-teal-500/30 group-[.toaster]:bg-teal-500/10 group-[.toaster]:text-teal-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
