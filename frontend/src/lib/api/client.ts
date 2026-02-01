// Simple API client wrapper
export const apiClient = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`/api${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Mock client for development
export const mockClient = {
  async get(endpoint: string) {
    // Return mock data based on endpoint
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const mockData: Record<string, any> = {
      '/dashboard': {
        kpis: {
          predictedCrowd: 156,
          yesterdayCrowd: 142,
          tokenUtilization: 87,
          mealsPrepared: 320,
          foodWastePercent: 8.5,
          supplyDemandMatch: 92,
          peakLoadFactor: 1.8,
        },
      },
      '/queue/stats': {
        activeTokens: 42,
        avgWaitTime: 12,
        servedToday: 247,
        queueLength: 15,
      },
      '/forecast': {
        predictedCrowd: 145,
        hourlyPredictions: Array.from({ length: 12 }, (_, i) => ({
          hour: `${i + 7}:00`,
          predicted: Math.floor(Math.random() * 50) + 30,
        })),
      },
    };

    return mockData[endpoint] || { data: null };
  },

  async post(endpoint: string, data: any) {
    console.log('Mock POST to:', endpoint, data);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data };
  },
};

// Use mock for development, real for production
export const client = process.env.NODE_ENV === 'production' ? apiClient : mockClient;