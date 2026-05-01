import { TokenService } from "@/comon/api/tokenService";
import { GuestLayout } from "@/comon/guestLayout"
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("accessToken");

        if (token) {
            TokenService.set(token);
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    }, []);
    return (
        <GuestLayout>
            <div className="flex flex-col items-center gap-4 text-center px-5">
                <span className="text-5xl animate-spin"><i className="ri-loader-2-line"></i></span>
                <h1 className="text-2xl font-bold">Authentication Running...</h1>
                <p className="text-sm text-muted-foreground">
                    After successful authentication, you will be redirected to the dashboard. Please wait a moment.
                </p>
            </div>
        </GuestLayout>
    )
}
