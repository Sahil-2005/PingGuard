import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: (token, email, displayName) => set({ token, user: { email, displayName } }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'pingguard-auth',
        }
    )
);
