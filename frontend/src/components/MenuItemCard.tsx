"use client";
import { getForecastStatus } from "@/utils/forecast";
import { useCartStore } from "@/stores/cart.store";
import Image from "next/image";

type Props = {
	id: number;
	name: string;
	price: number;
	image: string;
	maxQty: number;
	orderedQty: number;
};

export default function MenuItemCard({ id, name, price, image, maxQty, orderedQty }: Props) {
	const status = getForecastStatus(maxQty, orderedQty);
	const addItem = useCartStore((state) => state.addItem);

	const handleAdd = () => {
		addItem({ id, name, price, image });
		console.log("Added to cart:", id, name);
	};

	return (
		<div className="menu-card">
			<div className="image-wrapper">
				<Image src={image} alt={name} className={status.disabled ? "grayscale" : ""} />
				<span className={`badge ${status.color}`}>{status.label}</span>
			</div>

			<div className="content">
				<h3 className="item-name">{name}</h3>
				<p className="item-price">₹{price}</p>

				<button disabled={status.disabled} onClick={() => addItem({ id, name, price, image })}>
					{status.disabled ? "Unavailable" : "Add"}
				</button>
			</div>
		</div>
	);
}
