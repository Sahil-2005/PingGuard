import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useMonitors } from '../hooks/useMonitors';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useQueryClient } from '@tanstack/react-query';
import { Activity, Plus, Trash2, Globe, LogOut } from 'lucide-react';

export const DashboardPage = () => {
    const { user, logout } = useAuthStore();
    const { data: monitors, isLoading } = useMonitors();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showAddForm, setShowAddForm] = useState(false);
    const [newMonitor, setNewMonitor] = useState({ name: '', url: '', intervalSeconds: 60 });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAddMonitor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/monitors', { ...newMonitor, type: 'HTTPS' });
            setNewMonitor({ name: '', url: '', intervalSeconds: 60 });
            setShowAddForm(false);
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
        } catch (error) {
            alert('Failed to add monitor');
        }
    };

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to delete this monitor?')) {
            try {
                await api.delete(`/monitors/${id}`);
                queryClient.invalidateQueries({ queryKey: ['monitors'] });
            } catch (error) {
                alert('Failed to delete monitor');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 border-4 border-black p-4 md:p-6 bg-[#FFF6A3] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 md:gap-4">
                    <Activity size={32} strokeWidth={3} />
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">PingGuard</h1>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <span className="font-bold text-lg md:text-xl hidden sm:inline">Hi, {user?.displayName}</span>
                    <Button variant="dark" onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm md:text-base">
                        <LogOut size={20} /> Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black uppercase">Your Monitors</h2>
                    <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
                        <Plus size={24} /> Add Monitor
                    </Button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddMonitor} className="bg-white border-4 border-black p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block font-bold mb-2 uppercase text-sm">Name</label>
                            <Input placeholder="e.g. My API" value={newMonitor.name} onChange={e => setNewMonitor({...newMonitor, name: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-bold mb-2 uppercase text-sm">URL</label>
                            <Input placeholder="https://example.com" type="url" value={newMonitor.url} onChange={e => setNewMonitor({...newMonitor, url: e.target.value})} required />
                        </div>
                        <div className="md:col-span-1">
                            <Button type="submit" variant="primary" className="w-full">Save</Button>
                        </div>
                    </form>
                )}

                {isLoading ? (
                    <div className="text-2xl font-black uppercase animate-pulse">Loading monitors...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {monitors?.map(monitor => (
                            <div key={monitor.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-transform hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black truncate pr-4" title={monitor.name}>{monitor.name}</h3>
                                    <div className={`border-4 border-black px-3 py-1 font-bold text-sm uppercase flex-shrink-0
                                        ${monitor.status === 'UP' ? 'bg-[#99E1D9]' : 
                                          monitor.status === 'DOWN' ? 'bg-[#FF847C]' : 'bg-gray-200'}`}>
                                        {monitor.status}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 font-bold mb-6 truncate" title={monitor.url}>
                                    <Globe size={18} className="flex-shrink-0" />
                                    <span className="truncate">{monitor.url}</span>
                                </div>
                                <div className="mt-auto flex gap-4 pt-4 border-t-4 border-black">
                                    <Button variant="secondary" onClick={() => handleDelete(monitor.id)} className="w-full flex justify-center items-center gap-2">
                                        <Trash2 size={20} /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {monitors?.length === 0 && (
                            <div className="col-span-full text-center border-4 border-black border-dashed p-12 bg-gray-50">
                                <p className="text-2xl font-bold text-gray-500 uppercase">No monitors found. Add one above!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
