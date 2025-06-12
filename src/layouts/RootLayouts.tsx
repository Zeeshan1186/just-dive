import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface RootLayoutProps {
    children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
    const location = useLocation();
    const hideHeaderRoutes = ["/admin", "/admin/dashboard", "/login", "/thankyou", "/forgot-password", "/reset-password"];
    const shouldShowHeader = !hideHeaderRoutes.some((path) => location.pathname.startsWith(path));

    return (
        <div>
            {shouldShowHeader && (
                <Header />
            )}
            {children}
            {shouldShowHeader && <Footer />}
            <Toaster position="top-center" richColors closeButton />
        </div>
    );
}
