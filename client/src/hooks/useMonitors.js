import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export const useMonitors = () => {
    return useQuery({
        queryKey: ['monitors'],
        queryFn: async () => {
            const { data } = await api.get('/monitors');
            return data;
        },
        refetchInterval: 10000, // Poll every 10s
    });
};
