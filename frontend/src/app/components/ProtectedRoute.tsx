"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 💡 Wait for the asynchronous backend cookie check to complete
    if (!loading && !user) {
      // Prevent running a redirect if the user is already on public login/register routes
      if (pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
      }
    }
  }, [user, loading, router, pathname]);

  // 🔄 Keep the user in a safe loading viewport while Axios performs profile validation or rotation
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
          Verifying secure session...
        </p>
      </div>
    );
  }

  // Allow children dashboards to mount securely if authenticated or accessing login pages
  return <>{children}</>;
}
