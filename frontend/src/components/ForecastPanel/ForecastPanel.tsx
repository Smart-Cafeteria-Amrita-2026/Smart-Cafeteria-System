'use client';

import { useState } from 'react';
import { useStaffStore } from '@/src/stores/staffStore';
import styles from './ForecastPanel.module.css';

export default function ForecastPanel() {
  const { toggleForecastPanel } = useStaffStore();
  const [forecastData, setForecastData] = useState({
    currentParam: 75,
    seatsInCanteen: 200,
    timePerMealSlot: 60,
    ingredients: [
      { id: '1', name: 'Rice', quantity: 50, unit: 'kg' },
      { id: '2', name: 'Vegetables', quantity: 30, unit: 'kg' },
      { id: '3', name: 'Chicken', quantity: 20, unit: 'kg' },
      { id: '4', name: 'Spices', quantity: 5, unit: 'kg' },
    ],
    mealCategories: [
      { id: '1', name: 'Breakfast', slots: [] },
      { id: '2', name: 'Lunch', slots: [] },
      { id: '3', name: 'Snacks', slots: [] },
      { id: '4', name: 'Dinner', slots: [] },
    ],
  });

  return (
    <div className={styles.overlay} onClick={toggleForecastPanel}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>📊 Meal Forecasting</h2>
          <button onClick={toggleForecastPanel} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* Current Parameters */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>1) CURRENT PARAMETERS</h3>
            <div className={styles.paramGrid}>
              <div className={styles.paramCard}>
                <div className={styles.paramLabel}>Current Utilization</div>
                <div className={styles.paramValue}>
                  {forecastData.currentParam}%
                </div>
              </div>
              <div className={styles.paramCard}>
                <div className={styles.paramLabel}>Seats in Canteen</div>
                <div className={styles.paramValue}>
                  {forecastData.seatsInCanteen}
                </div>
              </div>
              <div className={styles.paramCard}>
                <div className={styles.paramLabel}>Time per Meal Slot</div>
                <div className={styles.paramValue}>
                  {forecastData.timePerMealSlot} min
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Forecast */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>4) INGREDIENTS REQUIRED</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Ingredient</th>
                    <th className={styles.th}>Quantity</th>
                    <th className={styles.th}>Unit</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className={styles.tr}>
                      <td className={styles.td}>{ingredient.name}</td>
                      <td className={styles.td}>{ingredient.quantity}</td>
                      <td className={styles.td}>{ingredient.unit}</td>
                      <td className={styles.td}>
                        <span className={styles.statusBadge}>
                          {ingredient.quantity > 10 ? 'Adequate' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Meal Categories */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>5) MEAL CATEGORIES & SLOTS</h3>
            <div className={styles.categoriesGrid}>
              {forecastData.mealCategories.map((category) => (
                <div key={category.id} className={styles.categoryCard}>
                  <h4 className={styles.categoryTitle}>{category.name}</h4>
                  <div className={styles.slotsList}>
                    <div className={styles.slotItem}>
                      <span className={styles.slotTime}>8:00 AM</span>
                      <span className={styles.slotCapacity}>50/50</span>
                    </div>
                    <div className={styles.slotItem}>
                      <span className={styles.slotTime}>9:00 AM</span>
                      <span className={styles.slotCapacity}>45/50</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Actions */}
          <div className={styles.actions}>
            <button className={styles.forecastButton}>
              🔮 Generate Forecast
            </button>
            <button className={styles.exportButton}>
              📥 Export Forecast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}