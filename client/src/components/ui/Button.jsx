import React from 'react';

export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseStyles = "font-bold py-3 px-6 border-4 border-black transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none uppercase tracking-wide";
    const variants = {
        primary: "bg-[#99E1D9] hover:bg-[#7DC1B9] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black",
        secondary: "bg-[#FF847C] hover:bg-[#F26A61] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black",
        outline: "bg-white hover:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black",
        dark: "bg-black text-white hover:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(153,225,217,1)]"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
