import logo from "../assets/images/JustDiveLogo.jpeg";
import { LoginForm } from "@/components/login-form"
import customImage from "@/assets/images/cta.png"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center items-center w-full md:w-full lg:w-full ">
                    <img src={logo} alt="Logo" className="w-38 md:w-36 lg:w-60" />
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
