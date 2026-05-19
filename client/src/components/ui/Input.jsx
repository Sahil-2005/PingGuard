import React from 'react';

export const Input = ({ className = '', ...props }) => {
    return (
        <input 
            className={`w-full font-bold px-4 py-3 border-4 border-black bg-[#FAF9F6] focus:bg-[#FFF6A3] focus:outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors text-lg ${className}`}
            {...props}
        />
    );
};
