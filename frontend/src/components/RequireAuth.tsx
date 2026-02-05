"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("authUser"); // 👈 login marker
        if (!user) {
            router.replace("/login?redirect=/payment");
        }
    }, [router]);

    return <>{children}</>;
}
