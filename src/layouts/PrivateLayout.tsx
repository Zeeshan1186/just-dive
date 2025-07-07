import { AppSidebar } from '@/components/app-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import person from '@/assets/images/john.png';
import { Outlet } from 'react-router-dom';

export default function PrivateLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-40 bg-background border-b border-gray-300 h-16 flex items-center px-4">                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4 " />
                    <div className="w-full flex justify-end">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={person} className='h-8 w-8' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-black">John Doe</p>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f5f6fb]">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
