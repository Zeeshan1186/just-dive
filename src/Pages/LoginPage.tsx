import logo from "../assets/images/JustDiveLogo.webp";
import { LoginForm } from "@/components/login-form";
import customImage from "@/assets/images/cta.webp";

export default function LoginPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left Side: Logo + Login */}
            <div className="flex flex-col gap-4 p-6 sm:p-2 md:p-10 lg:p-12">
                {/* Logo */}
                <div className="flex justify-center items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-32 sm:w-full md:w-40 lg:w-60"
                    />
                </div>

                {/* Login Form */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                        <LoginForm />
                    </div>
                </div>
            </div>

            {/* Right Side: Background Image */}
            <div className="relative hidden lg:block">
                <img
                    src={customImage}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
                />
            </div>
        </div>
    );
}
