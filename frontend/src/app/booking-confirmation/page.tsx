"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useCartStore } from "@/stores/cart.store";
import { useBookingStore } from "@/src/stores/booking.store";
import { useCreateBooking } from "@/src/hooks/useBooking";

type ConfirmationStatus = "loading" | "success" | "error";

export default function BookingConfirmationPage() {
	const router = useRouter();

	const { items, totalAmount, clearCart } = useCartStore();
	const { groupMembers, getSelectedSlot, resetBooking } = useBookingStore();
	const { mutateAsync: createBookingAsync } = useCreateBooking();

	const loaderRef = useRef<HTMLDivElement>(null);
	const successRef = useRef<HTMLDivElement>(null);
	const checkRef = useRef<SVGSVGElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const refRef = useRef<HTMLDivElement>(null);

	const [currentStatus, setCurrentStatus] = useState<ConfirmationStatus>("loading");
	const [bookingRef, setBookingRef] = useState("");
	const hasFiredRef = useRef(false);

	// Snapshot cart/booking data immediately so store clears don't affect us
	const snapshotRef = useRef<{
		slotId: number;
		groupSize: number;
		menuItems: { menu_item_id: number; quantity: number }[];
		groupMemberIds: string[] | undefined;
		totalAmount: number;
	} | null>(null);

	if (!snapshotRef.current && items.length > 0) {
		const slot = getSelectedSlot();
		if (slot) {
			snapshotRef.current = {
				slotId: slot.slot_id,
				groupSize: 1 + groupMembers.length,
				menuItems: items.map((item) => ({
					menu_item_id: item.id,
					quantity: item.quantity,
				})),
				groupMemberIds: groupMembers.length > 0 ? groupMembers.map((m) => m.id) : undefined,
				totalAmount: totalAmount(),
			};
		}
	}

	// Fire the booking mutation once on mount
	useEffect(() => {
		if (hasFiredRef.current) return;
		hasFiredRef.current = true;

		const snapshot = snapshotRef.current;
		if (!snapshot) {
			setCurrentStatus("error");
			return;
		}

		const fire = async () => {
			try {
				const response = await createBookingAsync({
					slot_id: snapshot.slotId,
					group_size: snapshot.groupSize,
					menu_items: snapshot.menuItems,
					group_member_ids: snapshot.groupMemberIds,
					total_amount: snapshot.totalAmount,
				});

				// Clear stores first, then update UI
				clearCart();
				resetBooking();
				setBookingRef(response.data.booking_reference);
				setCurrentStatus("success");
			} catch {
				setCurrentStatus("error");
			}
		};

		fire();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Loading animation
	useEffect(() => {
		if (currentStatus !== "loading" || !loaderRef.current) return;

		const dots = loaderRef.current.querySelectorAll(".loader-dot");
		const ring = loaderRef.current.querySelector(".loader-ring");

		if (ring) {
			gsap.to(ring, {
				rotation: 360,
				duration: 1.5,
				repeat: -1,
				ease: "linear",
				transformOrigin: "center center",
			});
		}

		if (dots.length > 0) {
			gsap.to(dots, {
				y: -12,
				duration: 0.4,
				stagger: 0.15,
				repeat: -1,
				yoyo: true,
				ease: "power2.inOut",
			});
		}
	}, [currentStatus]);

	// Success animation
	useEffect(() => {
		if (currentStatus !== "success") return;

		const tl = gsap.timeline();

		// Fade out loader
		if (loaderRef.current) {
			tl.to(loaderRef.current, {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => {
					if (loaderRef.current) loaderRef.current.style.display = "none";
				},
			});
		}

		// Show success container
		if (successRef.current) {
			tl.set(successRef.current, { display: "flex" });

			const circle = successRef.current.querySelector(".success-circle");
			if (circle) {
				tl.fromTo(
					circle,
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
				);
			}
		}

		// Draw the checkmark
		if (checkRef.current) {
			const path = checkRef.current.querySelector(".check-path");
			if (path) {
				const length = (path as SVGPathElement).getTotalLength();
				tl.set(path, { strokeDasharray: length, strokeDashoffset: length });
				tl.to(path, {
					strokeDashoffset: 0,
					duration: 0.6,
					ease: "power2.out",
				});
			}
		}

		// Fade in text
		if (textRef.current) {
			tl.fromTo(
				textRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
				"-=0.2"
			);
		}

		// Fade in booking reference
		if (refRef.current && bookingRef) {
			tl.fromTo(
				refRef.current,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
				"-=0.2"
			);
		}

		// Redirect to profile after a pause
		tl.call(
			() => {
				setTimeout(() => {
					router.replace("/profile?tab=bookings");
				}, 2000);
			},
			[],
			"+=0.5"
		);

		return () => {
			tl.kill();
		};
	}, [currentStatus, router, bookingRef]);

	// Error → redirect back
	useEffect(() => {
		if (currentStatus !== "error") return;

		if (loaderRef.current) {
			gsap.to(loaderRef.current, {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: "power2.in",
			});
		}

		const timer = setTimeout(() => {
			router.push("/checkout");
		}, 3000);

		return () => clearTimeout(timer);
	}, [currentStatus, router]);

	return (
		<div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white">
			{/* Loading State */}
			{currentStatus === "loading" && (
				<div ref={loaderRef} className="flex flex-col items-center gap-8">
					<div className="relative">
						<svg
							className="loader-ring h-20 w-20"
							viewBox="0 0 80 80"
							fill="none"
							role="img"
							aria-label="Loading"
						>
							<circle cx="40" cy="40" r="35" stroke="#E5E7EB" strokeWidth="5" fill="none" />
							<path
								d="M40 5 a35 35 0 0 1 35 35"
								stroke="#3B82F6"
								strokeWidth="5"
								strokeLinecap="round"
								fill="none"
							/>
						</svg>
					</div>

					<div className="flex items-center gap-2">
						<div className="loader-dot h-3 w-3 rounded-full bg-blue-500" />
						<div className="loader-dot h-3 w-3 rounded-full bg-blue-400" />
						<div className="loader-dot h-3 w-3 rounded-full bg-blue-300" />
					</div>

					<p className="text-gray-500 font-medium text-sm">Confirming your booking...</p>
				</div>
			)}

			{/* Success State */}
			<div ref={successRef} className="flex-col items-center gap-6" style={{ display: "none" }}>
				<div className="success-circle flex h-28 w-28 items-center justify-center rounded-full bg-green-50 ring-4 ring-green-100">
					<svg
						ref={checkRef}
						className="h-16 w-16"
						viewBox="0 0 64 64"
						fill="none"
						role="img"
						aria-label="Success"
					>
						<path
							className="check-path"
							d="M16 34 L26 44 L48 20"
							stroke="#22C55E"
							strokeWidth="5"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
						/>
					</svg>
				</div>

				<div ref={textRef} className="text-center space-y-2">
					<h1 className="text-2xl font-black text-gray-900">Booking Confirmed!</h1>
					<p className="text-gray-500 text-sm">Your meal has been booked successfully.</p>
				</div>

				{bookingRef && (
					<div
						ref={refRef}
						className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-center"
					>
						<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
							Booking Reference
						</p>
						<p className="text-lg font-black text-blue-600 tracking-wide">{bookingRef}</p>
					</div>
				)}

				<p className="text-xs text-gray-400 mt-2">Redirecting to your bookings...</p>
			</div>

			{/* Error State */}
			{currentStatus === "error" && (
				<div className="flex flex-col items-center gap-6 text-center">
					<div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-50 ring-4 ring-red-100">
						<svg
							className="h-16 w-16"
							viewBox="0 0 64 64"
							fill="none"
							role="img"
							aria-label="Error"
						>
							<path d="M20 20 L44 44" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
							<path d="M44 20 L20 44" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
						</svg>
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl font-black text-gray-900">Booking Failed</h1>
						<p className="text-gray-500 text-sm">Something went wrong. Redirecting back...</p>
					</div>
				</div>
			)}
		</div>
	);
}
