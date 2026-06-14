import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, MailIcon, CalendarClock, IdCardLanyard, ChartAreaIcon, ClipboardSignatureIcon, CalendarX, ScanSearchIcon } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"
import logo from "@/assets/images/logo.png"
import { Link } from "react-router-dom"
import type { UserPermission } from "@/comon/types/userDatatype"
import { useCurrentUser } from "@/hooks/userData"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: currentUser,
    isLoading,
    isError,
    error,
  } = useCurrentUser();

  const permissionData: UserPermission | null =
    currentUser?.usersPermissionManagement || null;

  React.useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user", {
        position: "top-right",
        richColors: true,
      });

      console.error(error);
    }
  }, [isError, error]);
  const data = {
    user: {
      name: currentUser
        ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ")
        : "",
      email: currentUser ? currentUser.email : "",
      avatar: currentUser ? currentUser.profilePicture : '',
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: (
          <LayoutDashboardIcon
          />
        ),
      },
      ...(permissionData && permissionData.holidayManagement
        ? [
          {
            title: "Inbox",
            url: "/inbox",
            icon: (
              <MailIcon
              />
            ),
          },
          {
            title: "Calendar",
            url: "/calender",
            icon: (
              <CalendarClock
              />
            ),
          },
        ]
        : []),
      ...(permissionData && permissionData.employeeManagement
        ? [
          {
            title: "Employees",
            url: "#",
            icon: <IdCardLanyard />,
          },
        ]
        : []),
      ...(permissionData && permissionData.attendanceManagement
        ? [
          {
            title: "Attendance",
            url: "#",
            icon: (
              <UsersIcon
              />
            ),
          },
        ]
        : []),
      {
        title: "Performance",
        url: "#",
        icon: (
          <ChartAreaIcon
          />
        ),
      },
      ...(permissionData && permissionData.payrollManagement
        ? [
          {
            title: "Payroll",
            url: "#",
            icon: (
              <ClipboardSignatureIcon
              />
            ),
          },
        ]
        : []),
      ...(permissionData && permissionData.leaveManagement
        ? [
          {
            title: "Leave Management",
            url: "#",
            icon: (
              <CalendarX
              />
            ),
          },
        ]
        : []),
      ...(permissionData && permissionData.recruitmentManagement
        ? [
          {
            title: "Recruitment",
            url: "#",
            icon: (
              <ScanSearchIcon
              />
            ),
          },
        ]
        : []),
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: (
          <Settings2Icon
          />
        ),
      },
      {
        title: "Get Help",
        url: "#",
        icon: (
          <CircleHelpIcon
          />
        ),
      },
      {
        title: "Search",
        url: "#",
        icon: (
          <SearchIcon
          />
        ),
      },
    ],
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <img src={logo} alt="TeamHub" className="w-7 h-7" />
                <span className="text-base font-semibold">TeamHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} permissions={permissionData} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? (
          <div className="flex flex-row gap-2">
            <Skeleton className="h-10 w-1/6 rounded-full" />
            <Skeleton className="h-10 w-5/6 rounded-md" />
          </div>
        ) : (
          <NavUser user={data.user} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
