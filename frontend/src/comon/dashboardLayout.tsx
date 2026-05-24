import type React from "react"
import { AuthLayout } from "./authLayout"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

type DashboardLayoutProps = {
    children: React.ReactNode;
    sideHeader: string;
};

export const DashboardLayout = ({ children, sideHeader }: DashboardLayoutProps) => {
    return (
        <AuthLayout>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader sideHeader={sideHeader} />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </AuthLayout>
    )
}
