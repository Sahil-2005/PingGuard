import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export const useIncidents = (monitorId) => {
    return useQuery({
        queryKey: ['incidents', monitorId],
        queryFn: async () => {
            const response = await api.get(`/monitors/${monitorId}/incidents`);
            return response.data;
        },
        enabled: !!monitorId,
        refetchInterval: 30000 // Refetch every 30s to keep it live
    });
};
