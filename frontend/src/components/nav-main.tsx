import type { UserPermission } from "@/comon/types/user/userDatatype"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function NavMain({
  items, permissions, currentUser
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
  permissions?: UserPermission | null
  currentUser?: any
}) {
  const { pathname } = useLocation();
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(url + "/");
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {...(permissions && permissions?.manageUser) ? [
              <SidebarMenuButton
                tooltip="Manage Permissions"
                className="min-w-8 bg-primary ps-3.5 text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <Link to="/manage-permissions" className="flex gap-2 items-center">
                  <Settings
                  />
                  <span>Manage {currentUser.role === 'admin' ? 'Company' : 'Candidate'}</span>
                </Link>
              </SidebarMenuButton>
            ] : []}
            {permissions && permissions?.notifications &&
              <Link to={"/notifications"}>
                <Button
                  size="icon"
                  className="size-8 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                  variant="outline"
                >
                  <Bell />
                  <span className="sr-only">Notifications</span>
                </Button>
              </Link>
            }
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="gap-1.5 mt-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url}>
                <SidebarMenuButton className={`cursor-pointer py-5 ps-3.5 ${isActive(item.url) ? "bg-zinc-800" : ""}`} tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
