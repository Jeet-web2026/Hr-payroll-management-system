import { Toaster } from "@/components/ui/sonner"
import type React from "react"

export const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      {children}
      <Toaster />
    </main>
  )
}
