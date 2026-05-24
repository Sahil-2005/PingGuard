import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

/**
 * @typedef {Object} LatencyPoint
 * @property {string} bucket - ISO string of the hour
 * @property {number} avgLatencyMs
 * @property {number} maxLatencyMs
 */

/**
 * @typedef {Object} DailyUptimePoint
 * @property {string} day - YYYY-MM-DD
 * @property {number} uptimePct - 0 to 100
 */

/**
 * @typedef {Object} AnalyticsSummaryResponse
 * @property {string} monitorId
 * @property {string} monitorName
 * @property {string} monitorUrl
 * @property {string} currentStatus
 * @property {string} lastCheckedAt
 * @property {number} uptime24h
 * @property {number} uptime7d
 * @property {number} uptime30d
 * @property {number} avgLatencyMs24h
 * @property {number} avgLatencyMs7d
 * @property {number} avgLatencyMs30d
 * @property {LatencyPoint[]} latencySeries
 * @property {DailyUptimePoint[]} dailyUptime
 */

/**
 * Fetches analytics data for a specific monitor.
 * @param {string} id - The UUID of the monitor
 * @returns {import('@tanstack/react-query').UseQueryResult<AnalyticsSummaryResponse, Error>}
 */
export const useMonitorAnalytics = (id) => {
    return useQuery({
        queryKey: ['monitors', id, 'analytics'],
        queryFn: async () => {
            const { data } = await api.get(`/monitors/${id}/stats`);
            return data;
        },
        enabled: !!id,
        // Poll every 30 seconds for real-time dashboard updates
        refetchInterval: 30000,
    });
};
