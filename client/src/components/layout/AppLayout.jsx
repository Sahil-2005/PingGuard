import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ReactLenis } from 'lenis/react';
import { Toaster } from 'sonner';

export const AppLayout = ({ children }) => {
    return (
        <ReactLenis root>
            <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
                <Navbar />
                <main className="flex-grow flex flex-col">
                    {children}
                </main>
                <Footer />
                <Toaster 
                    toastOptions={{
                        className: 'border-4 border-black font-bold uppercase rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white text-black'
                    }}
                />
            </div>
        </ReactLenis>
    );
};
