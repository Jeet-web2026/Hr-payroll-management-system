import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiService from "../api/apiService";
import { TokenService } from "../api/tokenService";
import { GuestLayout } from "../guestLayout";
import { useCurrentUser } from "@/hooks/userData";

const FullPageSpinner = () => (
    <GuestLayout>
        <span className="animate-spin text-4xl"><i className="ri-loader-2-line"></i></span>
    </GuestLayout>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [tokenReady, setTokenReady] = useState(!!TokenService.get());
    const [tokenFailed, setTokenFailed] = useState(false);

    useEffect(() => {
        if (tokenReady) return;

        const getToken = async () => {
            try {
                const res = await apiService.post("/auth/refresh", {});
                TokenService.set(res.data.data.accessToken);
                setTokenReady(true);
            } catch {
                setTokenFailed(true);
            }
        };

        getToken();
    }, [tokenReady]);

    const { data: user, isPending, isError } = useCurrentUser({ enabled: tokenReady });

    if (tokenFailed) return <Navigate to="/" />;
    if (!tokenReady || isPending) return <FullPageSpinner />;
    if (isError || !user) return <Navigate to="/" />;

    return <>{children}</>;
};

export default ProtectedRoute;