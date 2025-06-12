import { AppSidebar } from '@/components/app-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import person from '@/assets/images/john.png';

export default function PrivateLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex  border border-gray-300 h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
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
                <div className="flex flex-1 flex-col gap-4 p-4">
                    
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
