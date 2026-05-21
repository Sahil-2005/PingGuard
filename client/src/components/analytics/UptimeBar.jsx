import React from 'react';
import { format, parseISO } from 'date-fns';

/**
 * A horizontal row of up to 30 square blocks representing daily uptime.
 * Uses strict neubrutalism styling.
 * 
 * @param {Object} props
 * @param {Array<{day: string, uptimePct: number}>} props.data - The 30-day uptime data
 */
export const UptimeBar = ({ data = [] }) => {
    // Fill missing days if data is less than 30 to keep UI consistent
    const filledData = [...data];
    while (filledData.length < 30) {
        filledData.unshift({ day: null, uptimePct: null }); // Placeholder for no data
    }
    // ensure max 30 items
    const displayData = filledData.slice(-30);

    const getBlockColor = (uptimePct) => {
        if (uptimePct === null) return 'bg-gray-200'; // No data
        if (uptimePct >= 99.9) return 'bg-[#4ade80]'; // Green for excellent (Tailwind green-400)
        if (uptimePct >= 95.0) return 'bg-[#facc15]'; // Yellow for degraded (Tailwind yellow-400)
        return 'bg-[#f87171]'; // Red for down (Tailwind red-400)
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <h3 className="text-xl font-black uppercase tracking-wide text-black">30-Day Uptime History</h3>
            
            <div className="flex w-full h-12 md:h-16 gap-1 md:gap-2">
                {displayData.map((dayData, index) => (
                    <div 
                        key={index}
                        className={`flex-1 border-2 border-black ${getBlockColor(dayData.uptimePct)} 
                                   hover:-translate-y-1 transition-transform cursor-pointer relative group`}
                    >
                        {/* Tooltip on hover */}
                        {dayData.day && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-10 w-max">
                                <div className="bg-black text-white text-xs font-bold px-3 py-2 border-2 border-black whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]">
                                    <div className="text-center">{format(parseISO(dayData.day), 'MMM d, yyyy')}</div>
                                    <div className="text-center text-[#FFF6A3]">{dayData.uptimePct.toFixed(2)}% Uptime</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between text-sm font-bold text-black/60">
                <span>30 days ago</span>
                <span>Today</span>
            </div>
        </div>
    );
};
