import type { UserPermission } from "@/comon/types/userDatatype"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, CirclePlusIcon } from "lucide-react"
import { Link } from "react-router-dom"

export function NavMain({
  items, permissions
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
  permissions?: UserPermission | null
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {...(permissions && permissions?.manageUser) ? [
              <SidebarMenuButton
                tooltip="Manage Permissions"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <Link to="/manage-permissions" className="flex gap-2 items-center">
                  <CirclePlusIcon
                  />
                  <span>Manage Permissions</span>
                </Link>
              </SidebarMenuButton>
            ] : []}
            {permissions && permissions?.notifications &&
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <Bell />
                <span className="sr-only">Notifications</span>
              </Button>
            }
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url}>
                <SidebarMenuButton tooltip={item.title}>
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
