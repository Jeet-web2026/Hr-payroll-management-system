import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
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
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"
import apiService from "@/comon/api/apiService"
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    ipAddress: string;
    isEmailVerified: boolean;
    lastLogin: string;
    phone: string;
    profilePicture: string;
    role: string;
    status: string;
  }


  const [user, setUser] = React.useState<User | null>(null);
  const [pending, setPending] = React.useState(false);
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setPending(true);

        const res = await apiService.get('/user/me');
        setUser(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch user", { position: "top-right", richColors: true });
      } finally {
        setPending(false);
      }
    };

    fetchUser();
  }, []);
  const data = {
    user: {
      name: user ? user.firstName + " " + user.lastName : "",
      email: user ? user.email : "",
      avatar: user ? user.profilePicture : '',
    },
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: (
          <LayoutDashboardIcon
          />
        ),
      },
      {
        title: "Lifecycle",
        url: "#",
        icon: (
          <ListIcon
          />
        ),
      },
      {
        title: "Analytics",
        url: "#",
        icon: (
          <ChartBarIcon
          />
        ),
      },
      {
        title: "Projects",
        url: "#",
        icon: (
          <FolderIcon
          />
        ),
      },
      {
        title: "Team",
        url: "#",
        icon: (
          <UsersIcon
          />
        ),
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: (
          <CameraIcon
          />
        ),
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: (
          <FileTextIcon
          />
        ),
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: (
          <FileTextIcon
          />
        ),
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
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
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: (
          <DatabaseIcon
          />
        ),
      },
      {
        name: "Reports",
        url: "#",
        icon: (
          <FileChartColumnIcon
          />
        ),
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: (
          <FileIcon
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
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {pending ? (
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
