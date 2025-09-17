import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface RootLayoutProps {
    children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const hideHeaderRoutes = ["/admin", "/admin/dashboard", "/login", "/thankyou", "/forgot-password", "/reset-password"];
    const shouldShowHeader = !hideHeaderRoutes.some((path) => location.pathname.startsWith(path));

    useEffect(() => {
        if (location.pathname.startsWith("/admin")) {
            const token = localStorage.getItem("token"); // or your token key
            if (!token) {
                navigate("/login"); // redirect to login if no token
            }
        }
    }, [location, navigate]);

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
