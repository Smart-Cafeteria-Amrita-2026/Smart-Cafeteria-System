"use client";

import { useState, useEffect, useRef } from "react";
import { useStaffStore } from "@/src/stores/staffStore";
import { MEAL_TYPES, SLOT_TIMINGS } from "@/src/lib/constants";
import { MealType } from "@/src/lib/types/staff";
import styles from "./CreateSlotModal.module.css";

export default function CreateSlotModal() {
	const { closeCreateSlotModal } = useStaffStore();
	const [formData, setFormData] = useState({
		mealType: "BREAKFAST" as MealType,
		slotTiming: "",
		capacity: 50,
		mealName: "",
		mealDescription: "",
		ingredients: [] as Array<{ name: string; quantity: number; unit: string }>,
	});

	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscapeKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeCreateSlotModal();
			}
		};

		// Focus the modal when it opens
		if (modalRef.current) {
			modalRef.current.focus();
		}

		document.addEventListener("keydown", handleEscapeKey);
		return () => document.removeEventListener("keydown", handleEscapeKey);
	}, [closeCreateSlotModal]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log("Creating slot:", formData);
		closeCreateSlotModal();
	};

	const addIngredient = () => {
		setFormData({
			...formData,
			ingredients: [...formData.ingredients, { name: "", quantity: 0, unit: "kg" }],
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		}
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			closeCreateSlotModal();
		}
	};

	const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			closeCreateSlotModal();
		}
	};

	const handleContentKeyDown = (e: React.KeyboardEvent) => {
		// Prevent propagation of Escape key to overlay
		if (e.key === "Escape") {
			e.stopPropagation();
		}
	};

	return (
		<div
			className={styles.modalOverlay}
			onClick={handleOverlayClick}
			onKeyDown={handleOverlayKeyDown}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabIndex={-1}
		>
			<div
				ref={modalRef}
				className={styles.modalContent}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={handleContentKeyDown}
				tabIndex={-1}
				role="document"
			>
				<div className={styles.modalHeader}>
					<h2 id="modal-title" className={styles.modalTitle}>
						Create New Meal Slot
					</h2>
					<button
						onClick={closeCreateSlotModal}
						className={styles.closeButton}
						aria-label="Close modal"
						onKeyDown={(e) => handleKeyDown(e, closeCreateSlotModal)}
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGrid}>
						<div className={styles.formGroup}>
							<label htmlFor="mealType" className={styles.label}>
								Meal Type
							</label>
							<select
								id="mealType"
								value={formData.mealType}
								onChange={(e) => setFormData({ ...formData, mealType: e.target.value as MealType })}
								className={styles.select}
							>
								{Object.keys(MEAL_TYPES).map((key) => (
									<option key={key} value={key}>
										{key.charAt(0) + key.slice(1).toLowerCase()}
									</option>
								))}
							</select>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="slotTiming" className={styles.label}>
								Slot Timing
							</label>
							<select
								id="slotTiming"
								value={formData.slotTiming}
								onChange={(e) => setFormData({ ...formData, slotTiming: e.target.value })}
								className={styles.select}
							>
								<option value="">Select timing</option>
								{Object.values(SLOT_TIMINGS)
									.flat()
									.map((slot) => (
										<option key={slot.id} value={slot.label}>
											{slot.label}
										</option>
									))}
							</select>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="capacity" className={styles.label}>
								Capacity
							</label>
							<input
								id="capacity"
								type="number"
								value={formData.capacity}
								onChange={(e) =>
									setFormData({ ...formData, capacity: parseInt(e.target.value, 10) })
								}
								className={styles.input}
								min="1"
								max="100"
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="mealName" className={styles.label}>
								Meal Name
							</label>
							<input
								id="mealName"
								type="text"
								value={formData.mealName}
								onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
								className={styles.input}
								placeholder="Enter meal name"
							/>
						</div>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="mealDescription" className={styles.label}>
							Meal Description
						</label>
						<textarea
							id="mealDescription"
							value={formData.mealDescription}
							onChange={(e) => setFormData({ ...formData, mealDescription: e.target.value })}
							className={styles.textarea}
							placeholder="Describe the meal..."
							rows={3}
						/>
					</div>

					<div className={styles.ingredientsSection}>
						<div className={styles.sectionHeader}>
							<h3 className={styles.sectionTitle}>Ingredients Required</h3>
							<button
								type="button"
								onClick={addIngredient}
								onKeyDown={(e) => handleKeyDown(e, addIngredient)}
								className={styles.addButton}
							>
								+ Add Ingredient
							</button>
						</div>

						{formData.ingredients.map((ingredient, index) => (
							<div key={index} className={styles.ingredientRow}>
								<input
									id={`ingredient-name-${index}`}
									type="text"
									value={ingredient.name}
									onChange={(e) => {
										const newIngredients = [...formData.ingredients];
										newIngredients[index].name = e.target.value;
										setFormData({ ...formData, ingredients: newIngredients });
									}}
									className={styles.ingredientInput}
									placeholder="Ingredient name"
									aria-label={`Ingredient ${index + 1} name`}
								/>
								<input
									id={`ingredient-quantity-${index}`}
									type="number"
									value={ingredient.quantity}
									onChange={(e) => {
										const newIngredients = [...formData.ingredients];
										newIngredients[index].quantity = parseFloat(e.target.value);
										setFormData({ ...formData, ingredients: newIngredients });
									}}
									className={styles.quantityInput}
									placeholder="Quantity"
									min="0"
									step="0.1"
									aria-label={`Ingredient ${index + 1} quantity`}
								/>
								<select
									id={`ingredient-unit-${index}`}
									value={ingredient.unit}
									onChange={(e) => {
										const newIngredients = [...formData.ingredients];
										newIngredients[index].unit = e.target.value;
										setFormData({ ...formData, ingredients: newIngredients });
									}}
									className={styles.unitSelect}
									aria-label={`Ingredient ${index + 1} unit`}
								>
									<option value="kg">kg</option>
									<option value="g">g</option>
									<option value="l">l</option>
									<option value="ml">ml</option>
									<option value="pcs">pcs</option>
								</select>
							</div>
						))}
					</div>

					<div className={styles.formActions}>
						<button
							type="button"
							onClick={closeCreateSlotModal}
							onKeyDown={(e) => handleKeyDown(e, closeCreateSlotModal)}
							className={styles.cancelButton}
						>
							Cancel
						</button>
						<button type="submit" className={styles.submitButton}>
							Create Slot
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
