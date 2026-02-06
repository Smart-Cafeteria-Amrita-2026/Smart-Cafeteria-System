'use client';

import { useState } from 'react';
import Navbar from '@/src/components/Navigation/Navbar';
import { TrendingUp, CloudRain, Sun, Cloud, Calendar, Package, Users, ChefHat, Download, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

type ForecastData = {
  adjustedCrowd: number;
  slots: Array<{
    id: string;
    time: string;
    meal: string;
    description: string;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
    crowdExpected: number;
    capacity: number;
  }>;
  ingredientSummary: Array<{
    name: string;
    required: number;
    available: number;
    unit: string;
    status: 'adequate' | 'low' | 'critical';
    shortage?: number;
  }>;
  recommendations: string[];
};

export default function ForecastPage() {
  const [inputs, setInputs] = useState({
    crowdExpected: '200',
    weather: 'sunny',
    dayType: 'normal',
    rice: '60',
    vegetables: '25',
    chicken: '22',
    spices: '8',
    oil: '15',
    milk: '20',
  });

  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateForecast = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const crowd = parseInt(inputs.crowdExpected) || 200;
      
      // Calculate multipliers based on conditions
      let dayTypeMultiplier = 1;
      if (inputs.dayType === 'fest') dayTypeMultiplier = 1.4;
      else if (inputs.dayType === 'exam') dayTypeMultiplier = 0.7;
      else if (inputs.dayType === 'weekend') dayTypeMultiplier = 0.85;
      
      let weatherMultiplier = 1;
      if (inputs.weather === 'rainy') weatherMultiplier = 0.85;
      else if (inputs.weather === 'hot') weatherMultiplier = 1.1;
      
      const totalMultiplier = dayTypeMultiplier * weatherMultiplier;
      const adjustedCrowd = Math.round(crowd * totalMultiplier);
      
      // Per person consumption rates (in kg/person)
      const consumptionRates = {
        rice: 0.15,
        vegetables: 0.08,
        chicken: 0.06,
        spices: 0.005,
        oil: 0.01,
        milk: 0.05,
      };
      
      // Calculate total requirements
      const totalRequired = {
        rice: adjustedCrowd * consumptionRates.rice,
        vegetables: adjustedCrowd * consumptionRates.vegetables,
        chicken: adjustedCrowd * consumptionRates.chicken,
        spices: adjustedCrowd * consumptionRates.spices,
        oil: adjustedCrowd * consumptionRates.oil,
        milk: adjustedCrowd * consumptionRates.milk,
      };
      
      // Slot-wise distribution
      const slotDistribution = {
        breakfast: 0.25,
        lunch: 0.45,
        dinner: 0.30,
      };
      
      const slots = [
        {
          id: '1',
          time: '7:30 AM - 9:30 AM',
          meal: inputs.dayType === 'fest' ? 'Festival Breakfast Buffet' : 'Breakfast',
          description: inputs.weather === 'rainy' ? 'Hot comfort breakfast with warm beverages' : 'Energizing breakfast to start the day',
          ingredients: [
            { name: 'Rice', quantity: Math.round(totalRequired.rice * slotDistribution.breakfast * 10) / 10, unit: 'kg' },
            { name: 'Vegetables', quantity: Math.round(totalRequired.vegetables * slotDistribution.breakfast * 10) / 10, unit: 'kg' },
            { name: 'Milk', quantity: Math.round(totalRequired.milk * slotDistribution.breakfast * 10) / 10, unit: 'l' },
            { name: 'Oil', quantity: Math.round(totalRequired.oil * slotDistribution.breakfast * 10) / 10, unit: 'l' },
          ],
          crowdExpected: Math.round(adjustedCrowd * slotDistribution.breakfast),
          capacity: 200,
        },
        {
          id: '2',
          time: '12:00 PM - 2:00 PM',
          meal: inputs.dayType === 'fest' ? 'Grand Festival Lunch' : 'Lunch',
          description: 'Complete balanced meal with multiple options',
          ingredients: [
            { name: 'Rice', quantity: Math.round(totalRequired.rice * slotDistribution.lunch * 10) / 10, unit: 'kg' },
            { name: 'Vegetables', quantity: Math.round(totalRequired.vegetables * slotDistribution.lunch * 10) / 10, unit: 'kg' },
            { name: 'Chicken', quantity: Math.round(totalRequired.chicken * slotDistribution.lunch * 10) / 10, unit: 'kg' },
            { name: 'Spices', quantity: Math.round(totalRequired.spices * slotDistribution.lunch * 10) / 10, unit: 'kg' },
            { name: 'Oil', quantity: Math.round(totalRequired.oil * slotDistribution.lunch * 10) / 10, unit: 'l' },
          ],
          crowdExpected: Math.round(adjustedCrowd * slotDistribution.lunch),
          capacity: 200,
        },
        {
          id: '3',
          time: '6:30 PM - 8:30 PM',
          meal: 'Dinner',
          description: inputs.weather === 'hot' ? 'Light and refreshing dinner options' : 'Wholesome dinner to end the day',
          ingredients: [
            { name: 'Rice', quantity: Math.round(totalRequired.rice * slotDistribution.dinner * 10) / 10, unit: 'kg' },
            { name: 'Vegetables', quantity: Math.round(totalRequired.vegetables * slotDistribution.dinner * 10) / 10, unit: 'kg' },
            { name: 'Chicken', quantity: Math.round(totalRequired.chicken * slotDistribution.dinner * 10) / 10, unit: 'kg' },
            { name: 'Spices', quantity: Math.round(totalRequired.spices * slotDistribution.dinner * 10) / 10, unit: 'kg' },
          ],
          crowdExpected: Math.round(adjustedCrowd * slotDistribution.dinner),
          capacity: 200,
        },
      ];
      
      // Calculate ingredient summary with status
      const getStatus = (required: number, available: number): 'adequate' | 'low' | 'critical' => {
        const percentage = (available / required) * 100;
        if (percentage >= 100) return 'adequate';
        if (percentage >= 70) return 'low';
        return 'critical';
      };
      
      const ingredientSummary = [
        {
          name: 'Rice',
          required: Math.round(totalRequired.rice * 10) / 10,
          available: parseFloat(inputs.rice),
          unit: 'kg',
          status: getStatus(totalRequired.rice, parseFloat(inputs.rice)),
          shortage: Math.max(0, Math.round((totalRequired.rice - parseFloat(inputs.rice)) * 10) / 10),
        },
        {
          name: 'Vegetables',
          required: Math.round(totalRequired.vegetables * 10) / 10,
          available: parseFloat(inputs.vegetables),
          unit: 'kg',
          status: getStatus(totalRequired.vegetables, parseFloat(inputs.vegetables)),
          shortage: Math.max(0, Math.round((totalRequired.vegetables - parseFloat(inputs.vegetables)) * 10) / 10),
        },
        {
          name: 'Chicken',
          required: Math.round(totalRequired.chicken * 10) / 10,
          available: parseFloat(inputs.chicken),
          unit: 'kg',
          status: getStatus(totalRequired.chicken, parseFloat(inputs.chicken)),
          shortage: Math.max(0, Math.round((totalRequired.chicken - parseFloat(inputs.chicken)) * 10) / 10),
        },
        {
          name: 'Spices',
          required: Math.round(totalRequired.spices * 10) / 10,
          available: parseFloat(inputs.spices),
          unit: 'kg',
          status: getStatus(totalRequired.spices, parseFloat(inputs.spices)),
          shortage: Math.max(0, Math.round((totalRequired.spices - parseFloat(inputs.spices)) * 10) / 10),
        },
        {
          name: 'Oil',
          required: Math.round(totalRequired.oil * 10) / 10,
          available: parseFloat(inputs.oil),
          unit: 'l',
          status: getStatus(totalRequired.oil, parseFloat(inputs.oil)),
          shortage: Math.max(0, Math.round((totalRequired.oil - parseFloat(inputs.oil)) * 10) / 10),
        },
        {
          name: 'Milk',
          required: Math.round(totalRequired.milk * 10) / 10,
          available: parseFloat(inputs.milk),
          unit: 'l',
          status: getStatus(totalRequired.milk, parseFloat(inputs.milk)),
          shortage: Math.max(0, Math.round((totalRequired.milk - parseFloat(inputs.milk)) * 10) / 10),
        },
      ];
      
      // Generate recommendations
      const recommendations: string[] = [];
      const lowIngredients = ingredientSummary.filter(i => i.status === 'low' || i.status === 'critical');
      
      if (lowIngredients.length > 0) {
        recommendations.push(`⚠️ Order ${lowIngredients.map(i => i.name).join(', ')} immediately to meet demand`);
      }
      
      if (inputs.dayType === 'fest') {
        recommendations.push('🎉 Prepare extra servings and backup ingredients for festival rush');
      }
      
      if (inputs.weather === 'rainy') {
        recommendations.push('☔ Stock more hot beverages and comfort food ingredients');
      }
      
      if (inputs.dayType === 'exam') {
        recommendations.push('📚 Expect lower crowd, consider reducing preparation by 20-30%');
      }
      
      if (adjustedCrowd > crowd * 1.2) {
        recommendations.push('📈 High demand expected! Ensure adequate staff and seating arrangements');
      }
      
      setForecastData({
        adjustedCrowd,
        slots,
        ingredientSummary,
        recommendations,
      });
      
      setIsLoading(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateForecast();
  };

  const handleExport = () => {
    if (!forecastData) return;
    
    const csvContent = [
      ['Meal Forecast Report'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Adjusted Crowd Estimate:', forecastData.adjustedCrowd],
      [''],
      ['Slot-wise Breakdown'],
      ['Slot', 'Time', 'Meal', 'Expected Crowd', 'Capacity'],
      ...forecastData.slots.map(slot => [
        slot.id,
        slot.time,
        slot.meal,
        slot.crowdExpected,
        slot.capacity,
      ]),
      [''],
      ['Ingredient Requirements'],
      ['Ingredient', 'Required', 'Available', 'Unit', 'Status', 'Shortage'],
      ...forecastData.ingredientSummary.map(item => [
        item.name,
        item.required,
        item.available,
        item.unit,
        item.status,
        item.shortage || 0,
      ]),
      [''],
      ['Recommendations'],
      ...forecastData.recommendations.map(rec => [rec]),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal_forecast_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const weatherIcons = {
    sunny: <Sun size={20} />,
    rainy: <CloudRain size={20} />,
    cloudy: <Cloud size={20} />,
    hot: <Sun size={20} />,
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <TrendingUp className={styles.titleIcon} />
              Meal Demand Forecasting
            </h1>
            <p className={styles.subtitle}>
              AI-powered predictions to optimize your kitchen operations
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.inputSection}>
          <h2 className={styles.sectionTitle}>
            <BarChart3 size={24} />
            Input Parameters
          </h2>
          
          <div className={styles.inputGrid}>
            {/* Event & Conditions Card */}
            <div className={styles.inputCard}>
              <div className={styles.cardHeader}>
                <Calendar className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Event & Conditions</h3>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Users size={16} />
                  Expected Crowd
                </label>
                <input
                  type="number"
                  name="crowdExpected"
                  value={inputs.crowdExpected}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  min="1"
                  max="1000"
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  {weatherIcons[inputs.weather as keyof typeof weatherIcons]}
                  Weather Forecast
                </label>
                <select
                  name="weather"
                  value={inputs.weather}
                  onChange={handleInputChange}
                  className={styles.selectField}
                  required
                >
                  <option value="sunny">☀️ Sunny</option>
                  <option value="rainy">🌧️ Rainy</option>
                  <option value="cloudy">☁️ Cloudy</option>
                  <option value="hot">🔥 Hot</option>
                </select>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Calendar size={16} />
                  Day Type
                </label>
                <select
                  name="dayType"
                  value={inputs.dayType}
                  onChange={handleInputChange}
                  className={styles.selectField}
                  required
                >
                  <option value="normal">📅 Normal Day</option>
                  <option value="fest">🎉 Festival/Holiday</option>
                  <option value="exam">📚 Exam Day</option>
                  <option value="weekend">🏖️ Weekend</option>
                </select>
              </div>
            </div>
            
            {/* Available Ingredients Card */}
            <div className={styles.inputCard}>
              <div className={styles.cardHeader}>
                <Package className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Available Ingredients</h3>
              </div>
              
              <div className={styles.ingredientGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Rice (kg)</label>
                  <input
                    type="number"
                    name="rice"
                    value={inputs.rice}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Vegetables (kg)</label>
                  <input
                    type="number"
                    name="vegetables"
                    value={inputs.vegetables}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Chicken (kg)</label>
                  <input
                    type="number"
                    name="chicken"
                    value={inputs.chicken}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Spices (kg)</label>
                  <input
                    type="number"
                    name="spices"
                    value={inputs.spices}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Oil (l)</label>
                  <input
                    type="number"
                    name="oil"
                    value={inputs.oil}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Milk (l)</label>
                  <input
                    type="number"
                    name="milk"
                    value={inputs.milk}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.forecastButton}
            disabled={isLoading}
          >
            <TrendingUp size={24} />
            {isLoading ? 'Generating Forecast...' : 'Generate Forecast'}
          </button>
        </form>

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Analyzing patterns and calculating demand...</p>
          </div>
        )}

        {forecastData && !isLoading && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                <ChefHat className={styles.titleIcon} />
                Forecast Results
              </h2>
              <button onClick={handleExport} className={styles.exportButton}>
                <Download size={18} />
                Export CSV
              </button>
            </div>

            {/* Recommendations */}
            {forecastData.recommendations.length > 0 && (
              <div className={styles.recommendationsCard}>
                <h3 className={styles.recommendationsTitle}>
                  <AlertTriangle size={20} />
                  Action Items
                </h3>
                <ul className={styles.recommendationsList}>
                  {forecastData.recommendations.map((rec, idx) => (
                    <li key={idx} className={styles.recommendationItem}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary Stats */}
            <div className={styles.summaryStats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Users size={32} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Adjusted Crowd</div>
                  <div className={styles.statValue}>{forecastData.adjustedCrowd}</div>
                  <div className={styles.statSubtext}>Expected visitors</div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <ChefHat size={32} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Meal Slots</div>
                  <div className={styles.statValue}>{forecastData.slots.length}</div>
                  <div className={styles.statSubtext}>Service periods</div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Package size={32} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Ingredients</div>
                  <div className={styles.statValue}>{forecastData.ingredientSummary.length}</div>
                  <div className={styles.statSubtext}>Items tracked</div>
                </div>
              </div>
            </div>

            {/* Slot-wise Forecast */}
            <div className={styles.slotsSection}>
              <h3 className={styles.subsectionTitle}>Slot-wise Meal Plan</h3>
              <div className={styles.forecastGrid}>
                {forecastData.slots.map((slot) => (
                  <div key={slot.id} className={styles.slotCard}>
                    <div className={styles.slotHeader}>
                      <div className={styles.slotBadge}>{slot.time}</div>
                      <div className={styles.slotCapacity}>
                        {slot.crowdExpected}/{slot.capacity}
                      </div>
                    </div>
                    
                    <h4 className={styles.mealTitle}>{slot.meal}</h4>
                    <p className={styles.mealDescription}>{slot.description}</p>
                    
                    <div className={styles.ingredientList}>
                      <div className={styles.ingredientHeader}>Required Ingredients</div>
                      {slot.ingredients.map((ing, idx) => (
                        <div key={idx} className={styles.ingredientItem}>
                          <span className={styles.ingredientName}>{ing.name}</span>
                          <span className={styles.ingredientQuantity}>
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.slotFooter}>
                      <div className={styles.crowdInfo}>
                        <Users size={16} />
                        <span>{slot.crowdExpected} people expected</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredient Summary Table */}
            <div className={styles.summarySection}>
              <h3 className={styles.subsectionTitle}>Ingredient Summary</h3>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Required</th>
                      <th>Available</th>
                      <th>Status</th>
                      <th>Action Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecastData.ingredientSummary.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.ingredientNameCell}>
                          <Package size={16} />
                          {item.name}
                        </td>
                        <td className={styles.quantityCell}>
                          {item.required} {item.unit}
                        </td>
                        <td className={styles.quantityCell}>
                          {item.available} {item.unit}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                            {item.status === 'adequate' && <CheckCircle2 size={14} />}
                            {item.status !== 'adequate' && <AlertTriangle size={14} />}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className={styles.actionCell}>
                          {item.shortage && item.shortage > 0 ? (
                            <span className={styles.shortageText}>
                              Order {item.shortage} {item.unit}
                            </span>
                          ) : (
                            <span className={styles.adequateText}>No action needed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
