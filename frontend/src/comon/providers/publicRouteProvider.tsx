import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../api/apiService";
import { TokenService } from "../api/tokenService";
import { GuestLayout } from "../guestLayout";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = TokenService.get();

            if (token) {
                navigate("/dashboard");
                return;
            }

            try {
                const res = await apiService.post("/auth/refresh", {});
                TokenService.set(res.data.data.accessToken);
                navigate("/dashboard");
            } catch {
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <>
        <GuestLayout>
            <span className="animate-spin text-4xl"><i className="ri-loader-2-line"></i></span>
        </GuestLayout>
    </>;

    return <>{children}</>;
};

export default PublicRoute;