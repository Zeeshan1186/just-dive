import { AppSidebar } from '@/components/app-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import person from '@/assets/images/john.png';
import { Outlet, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useState } from 'react';

export default function PrivateLayout() {
    const navigate = useNavigate();
    const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const logOut = () => {
        setLoading(true);
        try {
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.log('error occur during log out');
        } finally {
            setLoading(false);
        }
    }
    return (
        <SidebarProvider>
            <ConfirmationDialog
                isOpen={confirmLogout}
                setIsOpen={setConfirmLogout}
                title={`Log out`}
                description={
                    <>
                        <p>Are you sure you want to log out?</p>
                    </>
                }
                isLoading={loading}
                isDisabled={loading}
                successAction={logOut}
                successLabel={"Log out"}
                successLoadingLabel={"Log out"}
                successVariant={"destructive"}
            />
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <AppSidebar />

                {/* Main content */}
                <div className="flex flex-1 flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-300 bg-background px-4">
                        <div className="flex items-center">
                            <SidebarTrigger className="mr-2" />
                            <Separator orientation="vertical" className="mx-2 hidden sm:block h-6" />
                        </div>
                        <div className="flex items-center gap-8 truncate mr-6">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer truncate">
                                        <Avatar>
                                            <AvatarImage src={person} className="h-8 w-8" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p className="text-black font-medium truncate">John Doe</p>
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-48 border-gray-200">
                                    <DropdownMenuItem onClick={() => {
                                        setConfirmLogout(true);
                                    }}>
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex flex-1 flex-col gap-4 p-4 bg-[#f5f6fb] overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
