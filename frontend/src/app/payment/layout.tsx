"use client";

import RequireAuth from "@/components/RequireAuth";

export default function PaymentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RequireAuth>{children}</RequireAuth>;
}
