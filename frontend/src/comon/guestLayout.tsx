import type React from "react"

export const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      {children}
    </main>
  )
}
