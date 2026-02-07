"use client";

import { useCartStore } from "@/stores/cart.store";
import { useRouter } from "next/navigation";

export default function StickyCartBar() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);

    if (items.length === 0) return null;

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <div
            style={{
                position: "fixed",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#111827",
                color: "white",
                padding: "14px 20px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                width: "90%",
                maxWidth: "420px",
                zIndex: 9999,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
        >
            <div>
                🛒 <strong>{items.length}</strong> items · ₹{total}
            </div>

            <button
                onClick={() => router.push("/cart")}
                style={{
                    background: "#2563eb",
                    border: "none",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: 500,
                }}
            >
                View Cart →
            </button>
        </div>
    );
}
