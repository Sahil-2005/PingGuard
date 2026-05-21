import React, { useState } from 'react';
import { useMonitors } from '../hooks/useMonitors';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Globe, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardPage = () => {
    const { data: monitors, isLoading } = useMonitors();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [showAddForm, setShowAddForm] = useState(false);
    const [newMonitor, setNewMonitor] = useState({ name: '', url: '', intervalSeconds: 60 });

    const handleAddMonitor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/monitors', { ...newMonitor, type: 'HTTPS' });
            setNewMonitor({ name: '', url: '', intervalSeconds: 60 });
            setShowAddForm(false);
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
            toast.success("Monitor added successfully!");
        } catch (error) {
            toast.error('Failed to add monitor');
        }
    };

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to delete this monitor?')) {
            try {
                await api.delete(`/monitors/${id}`);
                queryClient.invalidateQueries({ queryKey: ['monitors'] });
                toast.success("Monitor deleted");
            } catch (error) {
                toast.error('Failed to delete monitor');
            }
        }
    };

    return (
        <div className="flex-grow p-4 md:p-8 bg-[#FAF9F6] max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Your Monitors</h2>
                <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
                    <Plus size={24} /> Add Monitor
                </Button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddMonitor} 
                        className="bg-[#99E1D9] border-4 border-black p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-4 gap-4 items-end overflow-hidden"
                    >
                        <div className="md:col-span-1">
                            <label className="block font-bold mb-2 uppercase text-sm">Name</label>
                            <Input placeholder="e.g. My API" value={newMonitor.name} onChange={e => setNewMonitor({...newMonitor, name: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-bold mb-2 uppercase text-sm">URL</label>
                            <Input placeholder="https://example.com" type="url" value={newMonitor.url} onChange={e => setNewMonitor({...newMonitor, url: e.target.value})} required />
                        </div>
                        <div className="md:col-span-1">
                            <Button type="submit" variant="dark" className="w-full">Save Monitor</Button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="text-2xl font-black uppercase animate-pulse text-center mt-20">Loading endpoints...</div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    {monitors?.map(monitor => (
                        <motion.div 
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            key={monitor.id} 
                            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-black truncate pr-4" title={monitor.name}>{monitor.name}</h3>
                                <div className={`border-4 border-black px-3 py-1 font-black text-sm uppercase flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                    ${monitor.status === 'UP' ? 'bg-[#FFF6A3]' : 
                                      monitor.status === 'DOWN' ? 'bg-[#FF847C]' : 'bg-gray-200'}`}>
                                    {monitor.status}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 font-bold mb-6 truncate" title={monitor.url}>
                                <Globe size={18} className="flex-shrink-0" />
                                <span className="truncate">{monitor.url}</span>
                            </div>
                            <div className="mt-auto flex gap-4 pt-4 border-t-4 border-black">
                                <Button variant="primary" onClick={() => navigate(`/dashboard/monitors/${monitor.id}`)} className="w-full flex justify-center items-center gap-2">
                                    <Activity size={20} /> Analytics
                                </Button>
                                <Button variant="secondary" onClick={() => handleDelete(monitor.id)} className="w-full flex justify-center items-center gap-2">
                                    <Trash2 size={20} /> Delete
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                    {monitors?.length === 0 && (
                        <div className="col-span-full text-center border-4 border-black border-dashed p-12 bg-white">
                            <h3 className="text-3xl font-black uppercase mb-2">No Monitors Yet</h3>
                            <p className="text-xl font-bold text-gray-500 uppercase">Click "Add Monitor" to start tracking.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};
