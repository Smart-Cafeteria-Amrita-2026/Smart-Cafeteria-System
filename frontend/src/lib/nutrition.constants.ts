export type NutritionInfo = {
	calories: number; // kcal per serving
	carbs: number; // grams
	protein: number; // grams
	fat: number; // grams
	sugar: number; // grams
};

export const NUTRITION_DATA: Record<string, NutritionInfo> = {
	// -------- SNACKS --------

	"bansi-samosa": { calories: 262, carbs: 32, protein: 5, fat: 14, sugar: 3 },
	"egg-puff": { calories: 320, carbs: 28, protein: 11, fat: 20, sugar: 2 },
	Espresso: { calories: 5, carbs: 1, protein: 0, fat: 0, sugar: 0 },
	"filter-coffee": { calories: 120, carbs: 15, protein: 3, fat: 4, sugar: 12 },
	"ginger-tea": { calories: 110, carbs: 14, protein: 2, fat: 3, sugar: 11 },
	"Masala-Chai": { calories: 130, carbs: 16, protein: 3, fat: 5, sugar: 13 },
	"masala-vada": { calories: 180, carbs: 20, protein: 6, fat: 9, sugar: 2 },
	"Medu-Vada": { calories: 150, carbs: 18, protein: 4, fat: 8, sugar: 1 },
	"pani-puri": { calories: 180, carbs: 30, protein: 4, fat: 6, sugar: 6 },
	"pav-bhaji": { calories: 400, carbs: 55, protein: 9, fat: 15, sugar: 8 },
	"samosa-chat": { calories: 350, carbs: 45, protein: 8, fat: 16, sugar: 10 },
	"sev-puri": { calories: 270, carbs: 40, protein: 5, fat: 10, sugar: 6 },
	"vada-pav": { calories: 300, carbs: 40, protein: 7, fat: 14, sugar: 4 },
	"veg puffs": { calories: 290, carbs: 30, protein: 5, fat: 17, sugar: 3 },

	// -------- LUNCH --------

	"Chicken-Biryani": { calories: 500, carbs: 55, protein: 28, fat: 20, sugar: 3 },
	"Chicken-Curry": { calories: 350, carbs: 10, protein: 30, fat: 22, sugar: 3 },
	"Egg-Curry": { calories: 250, carbs: 8, protein: 16, fat: 18, sugar: 4 },
	"egg-fried-rice": { calories: 420, carbs: 60, protein: 12, fat: 14, sugar: 3 },
	"ghee-rice": { calories: 450, carbs: 60, protein: 8, fat: 18, sugar: 1 },
	"kerala-parotta": { calories: 260, carbs: 30, protein: 5, fat: 12, sugar: 1 },
	"Malabar-Chicken-Biryani": { calories: 550, carbs: 60, protein: 30, fat: 24, sugar: 3 },
	noodles: { calories: 380, carbs: 65, protein: 10, fat: 10, sugar: 5 },
	"Paneer-Curry": { calories: 420, carbs: 12, protein: 18, fat: 32, sugar: 5 },
	"Pulpy-Grape-Juice": { calories: 160, carbs: 38, protein: 1, fat: 0, sugar: 35 },
	"veg-curry": { calories: 220, carbs: 20, protein: 6, fat: 12, sugar: 6 },
	"veg-biriyani": { calories: 420, carbs: 65, protein: 9, fat: 14, sugar: 4 },

	// -------- DINNER --------

	"butter-chicken": { calories: 490, carbs: 10, protein: 30, fat: 38, sugar: 6 },
	chapathi: { calories: 120, carbs: 20, protein: 3, fat: 2, sugar: 1 },
	"chicken-tikka": { calories: 280, carbs: 5, protein: 35, fat: 14, sugar: 2 },
	chole_poori: { calories: 450, carbs: 55, protein: 12, fat: 20, sugar: 5 },
	"paneer-tikka-skewers": { calories: 350, carbs: 10, protein: 20, fat: 26, sugar: 3 },
	parotta: { calories: 300, carbs: 35, protein: 6, fat: 16, sugar: 1 },
	"potato-stuffed-naanjpg": { calories: 320, carbs: 45, protein: 7, fat: 12, sugar: 3 },
	"rava-dosa": { calories: 250, carbs: 35, protein: 5, fat: 10, sugar: 2 },

	// -------- BREAKFAST --------

	"Appam-and-Stew": { calories: 350, carbs: 50, protein: 8, fat: 12, sugar: 4 },
	chocos: { calories: 180, carbs: 35, protein: 3, fat: 2, sugar: 12 },
	cornflakes: { calories: 150, carbs: 30, protein: 4, fat: 1, sugar: 8 },
	dosa: { calories: 220, carbs: 30, protein: 5, fat: 8, sugar: 2 },
	"ghee-roast": { calories: 320, carbs: 35, protein: 5, fat: 16, sugar: 2 },
	idiyappam: { calories: 180, carbs: 40, protein: 4, fat: 1, sugar: 1 },
	idli: { calories: 120, carbs: 24, protein: 4, fat: 1, sugar: 1 },
	"masala-dosa": { calories: 300, carbs: 40, protein: 6, fat: 12, sugar: 3 },
	"Medu vada": { calories: 150, carbs: 18, protein: 4, fat: 8, sugar: 1 },
	"podi-idli": { calories: 200, carbs: 30, protein: 5, fat: 6, sugar: 1 },
	poha: { calories: 250, carbs: 40, protein: 6, fat: 7, sugar: 3 },
	pongal: { calories: 300, carbs: 45, protein: 8, fat: 10, sugar: 2 },
	"poori-masala": { calories: 420, carbs: 50, protein: 10, fat: 20, sugar: 4 },
	"rava-kichadi": { calories: 280, carbs: 40, protein: 6, fat: 9, sugar: 3 },
};
