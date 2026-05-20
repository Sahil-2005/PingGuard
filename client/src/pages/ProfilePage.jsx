import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { user, login, logout } = useAuthStore();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [newPassword, setNewPassword] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/users/profile', { displayName, newPassword });
            login(data.token, data.email, data.displayName);
            setNewPassword('');
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success("Logged out successfully");
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 py-12 bg-[#FFF6A3]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
                <h1 className="text-4xl font-black mb-6 uppercase tracking-tight text-[#FF847C]">
                    Your Profile
                </h1>

                <div className="mb-6 p-4 bg-[#99E1D9] border-4 border-black font-bold flex flex-col gap-2">
                    <div className="flex justify-between border-b-2 border-black pb-2 mb-2">
                        <span className="uppercase text-sm">Email</span>
                        <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="uppercase text-sm">Tier</span>
                        <span className="uppercase bg-white px-2 border-2 border-black">FREE</span>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">Display Name</label>
                        <Input 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)} 
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">New Password</label>
                        <Input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="Leave blank to keep current"
                            minLength={8}
                        />
                    </div>

                    <Button type="submit" variant="dark" className="w-full text-xl mt-4">
                        Save Changes
                    </Button>
                </form>

                <div className="mt-8 pt-8 border-t-4 border-black">
                    <Button variant="secondary" className="w-full" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
