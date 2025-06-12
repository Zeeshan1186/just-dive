import * as React from "react"
import { ChevronRight } from "lucide-react"
import { VersionSwitcher } from "@/components/version-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

const initialData = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
    },
    {
        title: "Manage Bookings",
        url: "#",
    },
    {
        title: "Manage Packages",
        url: "#",
        items: [
            {
                title: "Package List",
                url: "#",
            },
            {
                title: "Add Package",
                url: "#",
            },
        ],
    },
    {
        title: "Manage Location",
        url: "#",
    },
    {
        title: "Coupon Management",
        url: "#",
    },
    {
        title: "Reports",
        url: "#",
    },
    {
        title: "Manage Terms/Condition",
        url: "#",
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [activeItem, setActiveItem] = React.useState<string>("")

    const handleClick = (title: string) => {
        setActiveItem(title)
    }

    return (
        <Sidebar {...props} className="">
            <SidebarHeader className="bg-[#152259] border-gray-200">
                <VersionSwitcher />
            </SidebarHeader>

            <SidebarContent className="gap-0 bg-[#152259]">
                {initialData.map((item) =>
                    item.items ? (
                        <Collapsible
                            key={item.title}
                            title={item.title}
                            defaultOpen
                            className="group/collapsible text-white"
                        >
                            <SidebarGroup>
                                <SidebarGroupLabel
                                    asChild
                                    className="group/label text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                                >
                                    <CollapsibleTrigger>
                                        {item.title}
                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {item.items.map((child) => (
                                                <SidebarMenuItem key={child.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={activeItem === child.title}
                                                        className={
                                                            activeItem === child.title
                                                                ? "!bg-[#509CDB] !text-white"
                                                                : "text-white"
                                                        }
                                                    >
                                                        <a
                                                            href={child.url}
                                                            onClick={() => handleClick(child.title)}
                                                        >
                                                            {child.title}
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    ) : (
                        <SidebarGroup key={item.title}>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={activeItem === item.title}
                                        className={
                                            activeItem === item.title
                                                ? "!bg-[#509CDB] !text-white"
                                                : "text-white"
                                        }
                                    >
                                        <a
                                            href={item.url}
                                            onClick={() => handleClick(item.title)}
                                        >
                                            {item.title}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    )
                )}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    )
}
