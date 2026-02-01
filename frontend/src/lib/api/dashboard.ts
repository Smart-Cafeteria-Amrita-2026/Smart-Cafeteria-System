import { client } from './client';

export const fetchDashboardData = async () => {
  return await client.get('/dashboard');
};

export const updateForecastParameters = async (params: Record<string, any>) => {
  return await client.post('/dashboard/forecast', params);
};

export const fetchSustainabilityMetrics = async () => {
  return await client.get('/dashboard/sustainability');
};

export const fetchQueueAnalytics = async () => {
  return await client.get('/dashboard/queue-analytics');
};