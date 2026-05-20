import React from 'react';

export const Footer = () => {
    return (
        <footer className="border-t-4 border-black bg-black text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[#99E1D9]">PingGuard</h2>
                    <p className="font-bold text-gray-400">Monitoring your endpoints with brutal efficiency.</p>
                </div>
                <div className="font-bold uppercase tracking-widest text-sm">
                    © {new Date().getFullYear()} PingGuard Inc.
                </div>
            </div>
        </footer>
    );
};
