import { TooltipProvider } from "@/components/ui/tooltip"
import type React from "react"

export const AuthLayout = ({ children } : { children: React.ReactNode }) => {
  return (
    <main>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </main>
  )
}
