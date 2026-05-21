import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

/**
 * A brutalist Recharts area/line chart showing latency over time.
 * 
 * @param {Object} props
 * @param {Array<{bucket: string, avgLatencyMs: number, maxLatencyMs: number}>} props.data 
 */
export const LatencyChart = ({ data = [] }) => {
    
    // Format the X-axis tick (e.g. 14:00)
    const formatXAxis = (tickItem) => {
        if (!tickItem) return '';
        try {
            return format(parseISO(tickItem), 'HH:mm');
        } catch {
            return tickItem;
        }
    };

    // Custom Tooltip component with brutalist styling
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let formattedTime = label;
            try {
                formattedTime = format(parseISO(label), 'MMM d, HH:mm');
            } catch (e) { }

            return (
                <div className="bg-white border-4 border-black p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black border-b-2 border-black pb-1 mb-2">{formattedTime}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="font-bold text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="text-black">{entry.value} ms</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-80 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-wide text-black mb-4">Response Time (24H)</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                        <XAxis 
                            dataKey="bucket" 
                            tickFormatter={formatXAxis} 
                            stroke="#000" 
                            tick={{ fill: '#000', fontWeight: 'bold' }} 
                            axisLine={{ strokeWidth: 2, stroke: '#000' }}
                            tickLine={{ strokeWidth: 2, stroke: '#000' }}
                        />
                        <YAxis 
                            stroke="#000" 
                            tick={{ fill: '#000', fontWeight: 'bold' }}
                            axisLine={{ strokeWidth: 2, stroke: '#000' }}
                            tickLine={{ strokeWidth: 2, stroke: '#000' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Area 
                            type="step" 
                            dataKey="maxLatencyMs" 
                            name="Max Latency"
                            stroke="#000" 
                            strokeWidth={4} 
                            fill="#fecaca" 
                            fillOpacity={1}
                        />
                        <Area 
                            type="step" 
                            dataKey="avgLatencyMs" 
                            name="Avg Latency"
                            stroke="#000" 
                            strokeWidth={4} 
                            fill="#a7f3d0" 
                            fillOpacity={1} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
