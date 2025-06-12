import logo from "../assets/images/Justdive.png";
import { LoginForm } from "@/components/login-form"
import customImage from "@/assets/images/cta.png"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex items-center w-1/2 md:w-1/3 lg:w-1/4 ">
                    <img src={logo} alt="Logo" className="w-28 md:w-36 lg:w-40" />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src={customImage}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
