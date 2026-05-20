import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Activity } from 'lucide-react';

export const Navbar = () => {
    const { token } = useAuthStore();

    return (
        <nav className="border-b-4 border-black bg-[#99E1D9] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 transition-transform hover:-translate-y-1">
                    <Activity size={32} strokeWidth={3} />
                    <span className="text-2xl font-black uppercase tracking-tighter hidden sm:block">PingGuard</span>
                </Link>
                
                <div className="flex items-center gap-4">
                    {token ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="outline" className="px-4 py-2">Dashboard</Button>
                            </Link>
                            <Link to="/profile">
                                <Button variant="primary" className="px-4 py-2">Profile</Button>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button variant="primary">Login / Register</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
