import { apiGet } from "@/lib/api";

export interface MenuItem {
	id: string;
	name: string;
	price: number;
	image: string;
	description?: string;
	category: string;
	isAvailable: boolean;
}

import { breakfastMenu } from "@/data/breakfastMenu";
import { lunchMenu } from "@/data/lunchMenu";
import { snacksMenu } from "@/data/snacksMenu";
import { dinnerMenu } from "@/data/dinnerMenu";

const mapToMenuItem = (items: any[], category: string): MenuItem[] =>
	items.map((item) => ({
		id: String(item.id),
		name: item.name,
		price: item.price,
		image: item.image,
		description: item.description || `${item.name} - carefully prepared for you.`,
		category: category,
		isAvailable: true,
	}));

export const MenuService = {
	getMenuItems: async (mealType: string): Promise<MenuItem[]> => {
		try {
			return await apiGet<MenuItem[]>(`/menu?type=${mealType}`);
		} catch (error) {
			console.warn("Backend not detected, using local menu data.");
			switch (mealType) {
				case "breakfast":
					return mapToMenuItem(breakfastMenu, "breakfast");
				case "lunch":
					return mapToMenuItem(lunchMenu, "lunch");
				case "snacks":
					return mapToMenuItem(snacksMenu, "snacks");
				case "dinner":
					return mapToMenuItem(dinnerMenu, "dinner");
				default:
					return [];
			}
		}
	},
};
