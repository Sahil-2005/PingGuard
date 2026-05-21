import React from 'react';

/**
 * A massive, bold card displaying a single metric, styled with strict Neubrutalism.
 * 
 * @param {Object} props
 * @param {string} props.label - The label for the metric (e.g. "24H UPTIME")
 * @param {string|number} props.value - The massive value to display
 * @param {string} [props.suffix] - Optional suffix (e.g. "%" or "ms")
 * @param {string} [props.bgColor="bg-[#FFF6A3]"] - Tailwind background color class
 */
export const MetricCard = ({ label, value, suffix, bgColor = "bg-[#FFF6A3]" }) => {
    return (
        <div className={`p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${bgColor} flex flex-col justify-between h-full`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-black/80 mb-2">{label}</h3>
            <div className="flex items-baseline">
                <span className="text-5xl md:text-6xl font-black text-black tracking-tighter">
                    {value}
                </span>
                {suffix && (
                    <span className="text-2xl md:text-3xl font-bold text-black ml-1">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
};
