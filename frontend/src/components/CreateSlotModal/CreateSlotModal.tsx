'use client';

import { useState } from 'react';
import { useStaffStore } from '@/src/stores/staffStore';
import { MEAL_TYPES, SLOT_TIMINGS } from '@/src/lib/constants';
import { MealType } from '@/src/lib/types/staff';
import styles from './CreateSlotModal.module.css';

export default function CreateSlotModal() {
  const { closeCreateSlotModal } = useStaffStore();
  const [formData, setFormData] = useState({
    mealType: 'BREAKFAST' as MealType,
    slotTiming: '',
    capacity: 50,
    mealName: '',
    mealDescription: '',
    ingredients: [] as Array<{ name: string; quantity: number; unit: string }>,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating slot:', formData);
    closeCreateSlotModal();
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: 0, unit: 'kg' }],
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={closeCreateSlotModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Meal Slot</h2>
          <button onClick={closeCreateSlotModal} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Meal Type */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Meal Type</label>
              <select
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

            {/* Slot Timing */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Slot Timing</label>
              <select
                value={formData.slotTiming}
                onChange={(e) => setFormData({ ...formData, slotTiming: e.target.value })}
                className={styles.select}
              >
                <option value="">Select timing</option>
                {Object.values(SLOT_TIMINGS).flat().map((slot) => (
                  <option key={slot.id} value={slot.label}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className={styles.input}
                min="1"
                max="100"
              />
            </div>

            {/* Meal Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Meal Name</label>
              <input
                type="text"
                value={formData.mealName}
                onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                className={styles.input}
                placeholder="Enter meal name"
              />
            </div>
          </div>

          {/* Meal Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Meal Description</label>
            <textarea
              value={formData.mealDescription}
              onChange={(e) => setFormData({ ...formData, mealDescription: e.target.value })}
              className={styles.textarea}
              placeholder="Describe the meal..."
              rows={3}
            />
          </div>

          {/* Ingredients Section */}
          <div className={styles.ingredientsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Ingredients Required</h3>
              <button
                type="button"
                onClick={addIngredient}
                className={styles.addButton}
              >
                + Add Ingredient
              </button>
            </div>
            
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientRow}>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].name = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className={styles.ingredientInput}
                  placeholder="Ingredient name"
                />
                <input
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
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].unit = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className={styles.unitSelect}
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

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={closeCreateSlotModal}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Create Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}