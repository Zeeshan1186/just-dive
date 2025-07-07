import * as React from "react";
import { ChevronRight } from "lucide-react";
import { VersionSwitcher } from "@/components/version-switcher";
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
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Link, useLocation } from "react-router-dom";

const initialData = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
    },
    {
        title: "Manage Bookings",
        url: "/admin/booking",
    },
    {
        title: "Manage Packages",
        url: "#",
        items: [
            {
                title: "Package List",
                url: "/admin/package",
            },
            {
                title: "Add Package",
                url: "/admin/add-package",
            },
        ],
    },
    {
        title: "Manage Location",
        url: "/admin/location",
    },
    {
        title: "Coupon Management",
        url: "/admin/coupon",
    },
    {
        title: "Reports",
        url: "#",
    },
    {
        title: "Manage Terms/Condition",
        url: "/admin/Termscondition",
    },
    {
        title: "Blogs",
        url: "/admin/blogs",
    },
    {
        title: "Add Media",
        url: "/admin/addmedia",
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (url: string) =>
        currentPath === url || currentPath.startsWith(`${url}/`);

    return (
        <Sidebar {...props} className="">
            <SidebarHeader className="bg-[#152259] border-gray-200">
                <VersionSwitcher />
            </SidebarHeader>

            <SidebarContent className="gap-0 bg-[#152259] sidebar-no-scrollbar overflow-y-auto">
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
                                                        isActive={isActive(child.url)}
                                                        className={`py-1 px-2 text-sm ${isActive(child.url)
                                                            ? "!bg-[#509CDB] !text-white"
                                                            : "text-white"
                                                            }`}
                                                    >
                                                        <Link
                                                            to={child.url}
                                                        >
                                                            {child.title}
                                                        </Link>
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
                                        isActive={isActive(item.url)}
                                        className={
                                            isActive(item.url)
                                                ? "!bg-[#509CDB] !text-white"
                                                : "text-white"
                                        }
                                    >
                                        <Link
                                            to={item.url}
                                        >
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    )
                )}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
