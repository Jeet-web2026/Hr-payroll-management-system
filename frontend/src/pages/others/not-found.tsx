import { AuthLayout } from "@/comon/authLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <AuthLayout>
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 mx-4 max-w-2xl text-center">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 py-15 shadow-2xl backdrop-blur-xl">
                        <h2 className="mb-8 text-3xl font-bold">
                            ( Oops! Page Not Found )
                        </h2>

                        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                            The page you're looking for may have been moved,
                            deleted, or never existed.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate("/")}
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}