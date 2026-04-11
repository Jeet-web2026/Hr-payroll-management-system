import type React from "react"

export const AuthLayout = ({ children } : { children: React.ReactNode }) => {
  return (
    <main>
      {children}
    </main>
  )
}
